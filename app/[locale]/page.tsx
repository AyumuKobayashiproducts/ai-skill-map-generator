import type { Metadata } from "next";
import HomePage from "../page";

export const metadata: Metadata = {
  // ここではローカライズ前の共通タイトルをそのまま利用し、
  // Step 2 以降で必要に応じて locale ごとのタイトルに分けます。
  title: "AI Skill Map Generator"
};

interface LocaleHomePageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function LocaleHomePage({ searchParams }: LocaleHomePageProps) {
  // 現時点では HomePage コンポーネントをそのまま再利用し、
  // 文言のローカライズは次のステップで行います。
  return <HomePage searchParams={searchParams} />;
}



