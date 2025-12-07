import type { Metadata } from "next";
import HomePage from "../page";

export const metadata: Metadata = {
  // ここではローカライズ前の共通タイトルをそのまま利用し、
  // Step 2 以降で必要に応じて locale ごとのタイトルに分けます。
  title: "AI Skill Map Generator"
};

export default function LocaleHomePage({ searchParams }: any) {
  // ここでは HomePage コンポーネントをそのまま再利用し、
  // 文言のローカライズは NextIntl 側に委ねます。
  return <HomePage searchParams={searchParams} />;
}



