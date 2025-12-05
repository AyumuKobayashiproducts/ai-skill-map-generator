export default function AboutPage() {
  return (
    <div className="space-y-6 leading-relaxed">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          このアプリについて
        </h1>
        <p className="text-sm text-muted-foreground">
          「AI Skill Map Generator」は、若手 Web エンジニアの初めての転職を想定した、
          スキルマップ＆キャリアコーチングツールです。
          面接やポートフォリオ提出の場で、
          「自分が何を考えてこのプロダクトを作ったか」を説明しやすいように設計しています。
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">サービスの狙い</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          初めて転職を考えるエンジニアが、
          <br />
          「自分のスキルの現在地」「どこを伸ばせばよいか」「どの求人にどれくらいマッチしているか」
          をできるだけ短時間で把握できるようにすることをゴールにしています。
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>スキル棚卸しを AI で言語化する</li>
          <li>30日 / 90日のロードマップで「何からやるべきか」を明確にする</li>
          <li>気になる求人ごとに、マッチ度と不足スキルを把握できるようにする</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">自分の役割</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          このプロジェクトでは、企画・設計・実装のすべてを一人で担当しています。
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>ユーザーストーリーと画面遷移の設計</li>
          <li>Next.js（App Router）+ TypeScript によるフロントエンド実装</li>
          <li>Supabase / OpenAI を利用した API 設計と実装</li>
          <li>転職準備スコアなどのロジック設計とテストコードの作成</li>
          <li>UI デザイン調整・モバイル対応・Usage Logs 可視化</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">技術スタック</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>フロントエンド: Next.js 15 (App Router), TypeScript, Tailwind CSS</li>
          <li>バックエンド: Next.js Route Handlers（app/api/*）</li>
          <li>データストア / 認証: Supabase（Postgres, Auth）</li>
          <li>AI: OpenAI Node SDK を用いたスキル分析・求人マッチング・質問生成</li>
          <li>品質: Zod によるバリデーション、Vitest / Playwright によるテスト</li>
          <li>運用: Supabase の Row Level Security, usage_logs を使った利用状況の記録</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">今後やりたい改善</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          実務での利用やフィードバックを前提に、次のような改善を検討しています。
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>企業側のポジション要件を取り込んだ、より精度の高い求人マッチング</li>
          <li>スキルマップの履歴から、長期的な成長曲線を可視化する機能</li>
          <li>チームリーダーやメンターが、メンバーの成長を支援するためのビュー</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">この画面の想定シーン</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          面接やカジュアル面談の場で、
          <br />
          「このアプリを通して、自分がどう考え、どう設計・実装したか」を説明するための解説ページとして用意しています。
          実際の画面をお見せしながら、技術的な深掘りや設計の意図についてお話しできればと思っています。
        </p>
      </section>
    </div>
  );
}


