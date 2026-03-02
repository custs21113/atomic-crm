import polyglotI18nProvider from "ra-i18n-polyglot";
import { messages as chineseMessages } from "./messages/zh";
import { messages as englishMessages } from "./messages/en";

export const i18nProvider = polyglotI18nProvider(
  (locale: string) => {
    if (locale === "zh") {
      return chineseMessages;
    }
    return englishMessages;
  },
  "en",
  [
    { locale: "en", name: "English" },
    { locale: "zh", name: "中文" },
  ],
  { allowMissing: true },
);
