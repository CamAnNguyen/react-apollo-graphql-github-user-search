import * as sh from "shelljs";
import sha1 from "sha1";
import { promises as fs, existsSync } from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { argv as yargs } from "yargs";

dotenv.config({ path: path.resolve(__dirname, ".env") });

type IntlMessage = {
  id: string;
  defaultMessage: string;
  translatedFrom: string;
  apiTranslation?: true;
  error?: string;
};

export type Language = "en";

const tmpFile = ".i18n.tmp";
const sources = yargs._.join(" ");
const languages = (yargs["languages"] as string).split(",");
const defaultLanguage = yargs["default"] as string;
const output = yargs["output"] as string;
const check = yargs["check"] as boolean;

main().catch(console.error);

function asyncExec(cmd: string) {
  return new Promise<{ code: number; stdout: string; stderr: string }>(
    (resolve) =>
      sh.exec(
        cmd,
        { timeout: 30_000, silent: true, async: true },
        (code: number, stdout: string, stderr: string) => {
          resolve({ code, stdout, stderr });
        }
      )
  );
}

const formattedMessages = (messages: IntlMessage[]) =>
  JSON.stringify(messages, undefined, 2) + "\n";

async function main() {
  const outFile = (language: string) => path.join(output, `${language}.json`);

  sh.echo(
    `Generating the i18n messages file for default language '${defaultLanguage}':...`
  );
  const createMessagesCommand = await asyncExec(
    `formatjs extract --throws --extract-from-format-message-call "${sources}" > ${tmpFile}`
  );

  if (createMessagesCommand.code || createMessagesCommand.stderr) {
    console.log("Error while reading the messages from the source code:");
    console.error(createMessagesCommand.stderr);
    sh.exit(1);
  }

  const createMessagesOutput = await fs.readFile(tmpFile, "utf-8");
  const messagesDefaultLanguage = sortByIdAndRemoveDuplicates(
    JSON.parse(createMessagesOutput)
  );
  const newMessagesJson = formattedMessages(messagesDefaultLanguage);

  if (check) {
    const currentMessagesJson = await fs.readFile(
      outFile(defaultLanguage),
      "utf-8"
    );

    if (currentMessagesJson !== newMessagesJson) {
      checkFailed();
    }
  } else {
    await fs.writeFile(outFile(defaultLanguage), newMessagesJson);
  }

  sh.echo(
    `Generating the i18n messages file for default language '${defaultLanguage}': OK`
  );

  for (const language of languages) {
    if (language !== defaultLanguage) {
      sh.echo(
        `Adding new and removing old messages for additional language '${language}':...`
      );
      const languageFile = outFile(language);

      const [
        existingMessagesJson,
        existingMessages,
      ] = await readExistingMessages(languageFile);
      const existingMessagesById = Object.fromEntries(
        existingMessages.map((m) => [m.id, m])
      );

      if (check && existingMessages.length !== messagesDefaultLanguage.length) {
        checkFailed();
      }

      const messages = await Promise.all(
        messagesDefaultLanguage.map(
          async (message) =>
            await getTranslatedMessage(
              message,
              language as Language,
              existingMessagesById[message.id]
            )
        )
      );

      const formattedMessagesJson = formattedMessages(messages);

      if (check && existingMessagesJson !== formattedMessagesJson) {
        checkFailed();
      } else {
        await fs.writeFile(languageFile, formattedMessagesJson);
      }

      sh.echo(
        `Adding new and removing old messages for additional language '${language}': OK`
      );
    }
  }
}

function checkFailed() {
  sh.echo(
    `\x1b[31mThere are changes on i18n messages files. Please run 'yarn i18n' before commiting your changes.`
  );
  process.exit(1);
}

async function getTranslatedMessage(
  message: IntlMessage,
  language: Language,
  existingMessage: IntlMessage
) {
  if (
    existingMessage &&
    existingMessage.translatedFrom === message.defaultMessage
  ) {
    return existingMessage;
  } else {
    try {
      const translatedMessage = await translate(
        message.defaultMessage,
        language
      );

      // Fix this space put after translation: "<strong> {userAddress} </ strong>""
      const translatedMessageFixedTags = translatedMessage.replace(
        /<\/\s+([^>]+)\s*>/g,
        "</$1>"
      );

      return {
        id: message.id,
        defaultMessage: translatedMessageFixedTags,
        translatedFrom: message.defaultMessage,
        apiTranslation: true,
      } as IntlMessage;
    } catch (err) {
      return {
        id: message.id,
        defaultMessage: message.defaultMessage,
        translatedFrom: message.defaultMessage,
        error: err.message,
      } as IntlMessage;
    }
  }
}

async function readExistingMessages(languageFile: string) {
  try {
    const languageFileContent = await fs.readFile(languageFile, "utf8");

    return [
      languageFileContent,
      JSON.parse(languageFileContent || "[]") as IntlMessage[],
    ] as const;
  } catch (err) {
    if (
      !(err.message as string).includes("ENOENT: no such file or directory")
    ) {
      throw err;
    } else {
      return [];
    }
  }
}

async function translate(
  originalMessage: string,
  language: Language
): Promise<string> {
  const apiName = getCurrentApi();
  const api = translationApi[apiName];
  const [message, markers] = api.replaceMarkers(originalMessage);

  if (message.includes("{") || message.includes("}")) {
    // Avoid calling translation API when there is complex parameters, that would have its syntax
    // broken with simple regex /\{[^}]+\}/ replacements. Examples:
    // - "I am a {gender, select, male {boy} female {girl}}"
    // - "I have {num, plural, one {# dog} other {# dogs}}"
    throw new Error("API translation not supported.");
  }

  const apiResult = await callTranslationApi(apiName, message, language);
  const translatedMessage = api.unreplaceMarkers(apiResult, markers);

  return translatedMessage;
}

async function callTranslationApi(
  apiName: ApiName,
  message: string,
  language: Language
) {
  let jsonContent: string;
  const api = translationApi[apiName];
  const cacheFile = path.join(
    __dirname,
    `i18n-${apiName}-cache/${sha1(message)}_${language}.json`
  );

  // Cache API result content to avoid Google detecting violation of their Terms
  if (existsSync(cacheFile)) {
    jsonContent = await fs.readFile(cacheFile, "utf-8");
  } else {
    jsonContent = await api.callApi(message, language);
    await fs.writeFile(cacheFile, jsonContent, "utf-8");
  }

  return api.parseResponse(jsonContent);
}

const translationApi = {
  google: {
    async callApi(message: string, language: Language): Promise<string> {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodedMessage}`;
      const httpResult = await fetch(url);

      if (httpResult.status !== 200) {
        throw new Error(`Error translating: ${url}`);
      }

      return await httpResult.text();
    },
    parseResponse(response: string): string {
      return JSON.parse(response)[0]
        .map((piece: [string]) => piece[0])
        .join("");
    },
    replaceMarkers(originalMessage: string) {
      const markers = originalMessage.match(/\{[^}]+\}/g) || [];
      let newMsg = originalMessage;

      markers?.forEach(
        (m, i) => (newMsg = newMsg.replace(m, `[MARKER_NUMBER_${i}]`))
      );
      return [newMsg, markers] as const;
    },
    unreplaceMarkers(translatedMessage: string, markers: RegExpMatchArray) {
      let message = translatedMessage;

      markers?.forEach(
        (m, i) => (message = message.replace(`[MARKER_NUMBER_${i}]`, m))
      );
      return message;
    },
  },
};

type ApiName = keyof typeof translationApi;

const existingApiList = Object.keys(translationApi) as ApiName[];

function getCurrentApi(): ApiName {
  const api = (process.env.I18N_API as ApiName) || "google";

  if (!existingApiList.includes(api)) {
    throw new Error(
      `Translation API '${api}' is not supported. Allowed values of I18N_API is: ${existingApiList.join(
        ", "
      )}`
    );
  }

  return api;
}

function sortByIdAndRemoveDuplicates(messages: IntlMessage[]) {
  const withoutDuplicates = Object.values(
    Object.fromEntries(messages.map((m) => [m.id, m]))
  );

  withoutDuplicates.sort((a, b) => a.id.localeCompare(b.id));
  return withoutDuplicates;
}
