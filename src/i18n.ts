import {getRequestConfig} from "next-intl/server";
import {locales, defaultLocale, type Locale} from "./i18n/config";

export default getRequestConfig(async ({locale}) => {
  const localeValue = (locale ?? defaultLocale) as Locale;
  const currentLocale: Locale = (locales as readonly string[]).includes(
    localeValue
  )
    ? localeValue
    : defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default
  };
});







