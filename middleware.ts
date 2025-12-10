import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  // API ルートや Next.js の内部パスは除外しつつ、アプリケーションルート全体に適用
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};








