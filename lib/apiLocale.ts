import { locales, type Locale, defaultLocale } from "@/src/i18n/config";

function isSupportedLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getRequestLocale(request: Request): Locale {
  // 1. Explicit header (client-side fetch から渡したい場合用)
  const headerLocale = request.headers.get("x-locale");
  if (isSupportedLocale(headerLocale)) {
    return headerLocale;
  }

  // 2. Referer のパスから推測（例: https://.../en/result/xxx）
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      const segment = url.pathname.split("/")[1];
      if (isSupportedLocale(segment)) {
        return segment;
      }
    } catch {
      // 解析に失敗した場合はスキップしてフォールバック
    }
  }

  // 3. next-intl の Cookie から取得（デフォルト名: NEXT_LOCALE）
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = /NEXT_LOCALE=([^;]+)/.exec(cookieHeader);
    if (match && isSupportedLocale(match[1])) {
      return match[1];
    }
  }

  // 4. それでも分からなければデフォルトロケール
  return defaultLocale;
}



