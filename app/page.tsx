import { SkillForm } from "@/components/SkillForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3 animate-fade-in-up">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-600">
          For your first career move
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          スキルとキャリアを
          <span className="gradient-text">
            {" "}
            一枚のマップ
          </span>
          に。
        </h2>
        <p className="text-sm md:text-base text-slate-700 max-w-xl leading-relaxed">
          職務経歴やスキルセットを日本語で入力するだけで、
          AI がスキルマップ・学習ロードマップ・求人マッチング・面接練習までまとめて用意します。
          <br />
          「何から始めればいいか」を、一緒にゆっくり整理していきましょう。
        </p>
      </section>

      <section className="space-y-3 animate-fade-in-up stagger-2">
        <p className="text-xs font-semibold text-slate-700">
          まずはこの 3 ステップだけで OK です。
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: 1,
              title: "ゴールを選ぶ",
              desc: "「フロントエンド特化」「フルスタック」など、いま近づきたいキャリアのイメージを一つだけ選びます。",
              icon: "🎯"
            },
            {
              step: 2,
              title: "スキル・職務経歴を入力",
              desc: "いままでやってきたことを日本語でそのまま書きます。サンプル文をベースに少し書き換えるだけでも大丈夫です。",
              icon: "✍️"
            },
            {
              step: 3,
              title: "結果で全体像をつかむ",
              desc: "スキルマップと転職準備スコアを見て、どこを伸ばせば良いか・どんな求人が合いそうかを一緒に確認します。",
              icon: "📊"
            }
          ].map((item, idx) => (
            <div
              key={item.step}
              className={`group relative rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm card-hover animate-fade-in-up stagger-${idx + 3}`}
            >
              <div className="absolute -top-3 -left-1 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  {item.title}
                </p>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start animate-fade-in-up stagger-5">
        <div className="space-y-4 text-xs text-slate-700">
          <p className="font-semibold text-slate-900 text-sm">このツールでできること</p>
          <ul className="space-y-2.5">
            {[
              { icon: "🗺️", text: "スキルマップと「あなたのクラス（ジョブ）」を自動生成" },
              { icon: "📅", text: "30日 / 90日ロードマップと今日やることの提案" },
              { icon: "💼", text: "気になる求人とのマッチングスコアと不足スキルの可視化" },
              { icon: "🎤", text: "評価面談を想定した 1on1 練習とフィードバック" },
              { icon: "📄", text: "転職用ポートフォリオの棚卸しと Markdown 出力" }
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2.5 group">
                <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="group-hover:text-slate-900 transition-colors">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/50 overflow-hidden animate-scale-in stagger-6">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">スキル入力フォーム</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Ready
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <SkillForm />
          </div>
        </div>
      </div>
    </div>
  );
}
