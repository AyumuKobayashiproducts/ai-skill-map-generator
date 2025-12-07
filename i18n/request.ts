import {getRequestConfig as getNextIntlRequestConfig} from "next-intl/server";
import {locales as appLocales, defaultLocale as appDefaultLocale} from "../src/i18n/config";

export default getNextIntlRequestConfig(async ({locale}) => {
  const localeValue = locale ?? appDefaultLocale;
  const currentLocale = (appLocales as readonly string[]).includes(localeValue)
    ? localeValue
    : appDefaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`../src/messages/${currentLocale}.json`)).default
  };
});

