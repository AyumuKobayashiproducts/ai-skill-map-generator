import { redirect } from "next/navigation";
import { defaultLocale } from "@/src/i18n/config";

export default function AuthLoginPage() {
  // 旧 /auth/login へのアクセスはデフォルトロケール付きにリダイレクト
  redirect(`/${defaultLocale}/auth/login`);
}
