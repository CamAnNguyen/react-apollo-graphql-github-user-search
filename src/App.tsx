import { useSelector } from "react-redux";
import { RawIntlProvider } from "react-intl";

import { makeIntl, messages } from "i18n";
import { AppLoader } from "components/AppLoader";
import { getLanguage } from "store/ui/selectors";
import { AppRouter } from "routes/AppRouter";

import './App.scss';

function App() {
  const language = useSelector(getLanguage);
  const intl = makeIntl(language, messages);

  return (
    <RawIntlProvider value={intl}>
      <AppLoader />
      <AppRouter />
    </RawIntlProvider>
  );
}

export default App;