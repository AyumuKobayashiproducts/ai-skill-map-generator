import {getRequestConfig} from "next-intl/server";
import {locales, defaultLocale, type Locale} from "./src/i18n/config";

export default getRequestConfig(async ({locale}) => {
  const localeValue = locale ?? defaultLocale;
  const currentLocale: Locale = (locales as readonly string[]).includes(
    localeValue
  )
    ? (localeValue as Locale)
    : defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./src/messages/${currentLocale}.json`)).default
  };
});

export {locales, defaultLocale};



