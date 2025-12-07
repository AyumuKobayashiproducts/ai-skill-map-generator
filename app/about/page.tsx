import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const techStack = [
  { category: "フロントエンド", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS"], emoji: "🎨" },
  { category: "バックエンド", items: ["Next.js Route Handlers", "Edge Functions"], emoji: "⚙️" },
  { category: "データ / 認証", items: ["Supabase (Postgres)", "Supabase Auth"], emoji: "🗄️" },
  { category: "AI", items: ["OpenAI API", "GPT-4o"], emoji: "🤖" },
  { category: "品質", items: ["Zod", "Vitest", "Playwright"], emoji: "✅" },
  { category: "運用", items: ["Row Level Security", "Usage Logs"], emoji: "📊" }
];

const features = [
  { title: "スキル棚卸し", desc: "AI が職務経歴を分析し、スキルを言語化", icon: "🗺️" },
  { title: "ロードマップ生成", desc: "30日/90日の具体的な学習計画を自動作成", icon: "📅" },
  { title: "求人マッチング", desc: "求人票との相性とギャップを可視化", icon: "💼" }
];

const roles = [
  { title: "企画・設計", desc: "ユーザーストーリーと画面遷移の設計", icon: "📋" },
  { title: "フロントエンド", desc: "Next.js + TypeScript での UI 実装", icon: "🖥️" },
  { title: "バックエンド", desc: "Supabase / OpenAI を利用した API 設計", icon: "🔧" },
  { title: "テスト", desc: "ロジック設計とテストコードの作成", icon: "🧪" },
  { title: "デザイン", desc: "UI 調整・モバイル対応・UX 改善", icon: "🎨" }
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <header className="space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-500/25">
            ℹ️
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              このアプリについて
            </h1>
            <p className="text-sm text-slate-500">
              AI Skill Map Generator の概要と技術スタック
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
          「AI Skill Map Generator」は、若手 Web エンジニアの初めての転職を想定した、
          スキルマップ＆キャリアコーチングツールです。
          面接やポートフォリオ提出の場で、
          「自分が何を考えてこのプロダクトを作ったか」を説明しやすいように設計しています。
        </p>
      </header>

      {/* Features */}
      <section className="animate-fade-in-up stagger-1">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>✨</span> サービスの狙い
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={feature.title} className="card-hover animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CardContent className="pt-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center text-xl mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* My role */}
      <section className="animate-fade-in-up stagger-2">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>👤</span> 自分の役割
        </h2>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-700 mb-4">
              このプロジェクトでは、企画・設計・実装のすべてを一人で担当しています。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {roles.map((role) => (
                <div 
                  key={role.title} 
                  className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-2xl">{role.icon}</span>
                  <p className="text-xs font-semibold text-slate-900 mt-2">{role.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tech stack */}
      <section className="animate-fade-in-up stagger-3">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🛠️</span> 技術スタック
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <Card key={tech.category} className="card-hover">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tech.emoji}</span>
                  <h3 className="font-semibold text-slate-900 text-sm">{tech.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.items.map((item) => (
                    <span 
                      key={item}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Future improvements */}
      <section className="animate-fade-in-up stagger-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>🚀</span> 今後やりたい改善
        </h2>
        <Card className="bg-gradient-to-br from-sky-50/50 to-indigo-50/50">
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {[
                { icon: "🎯", text: "企業側のポジション要件を取り込んだ、より精度の高い求人マッチング" },
                { icon: "📈", text: "スキルマップの履歴から、長期的な成長曲線を可視化する機能" },
                { icon: "👥", text: "チームリーダーやメンターが、メンバーの成長を支援するためのビュー" }
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-sm text-slate-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Interview scene */}
      <section className="animate-fade-in-up stagger-5">
        <Card className="border-2 border-sky-200/50 bg-gradient-to-r from-sky-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💬</span>
              この画面の想定シーン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed">
              面接やカジュアル面談の場で、
              「このアプリを通して、自分がどう考え、どう設計・実装したか」を説明するための解説ページとして用意しています。
              実際の画面をお見せしながら、技術的な深掘りや設計の意図についてお話しできればと思っています。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Feedback */}
      <section className="animate-fade-in-up stagger-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <span>🗣️</span>
              フィードバック・改善アイデアはこちら
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs md:text-sm text-slate-700">
            <p>
              「ここが分かりづらかった」「こういう機能が欲しい」などのフィードバックがあれば、ぜひ教えてください。
              実務でも使えるプロダクトに近づけていきたいと考えています。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/discussions"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs md:text-sm font-medium shadow-sm hover:bg-sky-700 transition-colors"
              >
                💬 GitHub Discussions を開く
              </Link>
              <Link
                href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/issues/new/choose"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs md:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                🐛 Issue / Feature リクエストを作成
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
