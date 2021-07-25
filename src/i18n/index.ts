import { createIntl, createIntlCache, IntlShape } from "react-intl";

import en from "./languages/en.json";

type Message = typeof en[number];

function convertToKeyValuePair(strings: Message[]) {
  return Object.fromEntries(strings.map((str) => [str.id, str.defaultMessage]));
}

export const displayLanguages = {
  default: "en",
  additional: [],
};

export const messages = {
  en: convertToKeyValuePair(en),
};

export type Language = keyof typeof messages;
export const defaultLanguage = displayLanguages.default;

const intlCache = createIntlCache();

export let intl: IntlShape;

export function makeIntl(language: any, messages: any) {
  intl = createIntl(
    {
      locale: language,
      messages: messages[language],
    },
    intlCache
  );
  return intl;
}
