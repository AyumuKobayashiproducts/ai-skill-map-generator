import Link from "next/link";
import { SkillForm } from "@/components/SkillForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          AI × キャリア診断
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          職務経歴を入力するだけで、
          <br />
          <span className="gradient-text">
            転職準備がまるっと完成
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
          スキルマップ・学習ロードマップ・求人マッチング・面接練習を
          <span className="font-semibold text-slate-900"> 60秒で一括生成</span>。
          <br />
          「何から始めればいいか分からない」を、今すぐ解決します。
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>完全無料</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>登録はメールアドレスのみ</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>60秒で診断完了</span>
          </div>
        </div>
      </section>

      <section className="space-y-4 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            たった 3 ステップ
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
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
              className={`group relative rounded-xl border-2 border-slate-200 bg-white px-5 py-6 shadow-sm card-hover animate-fade-in-up stagger-${idx + 3} hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 transition-all duration-300`}
            >
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-sky-500/40 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                {item.step}
              </div>
              <div className="mt-2">
                <p className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* はじめての方へガイド */}
      <section className="animate-fade-in-up stagger-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-md">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-xl flex-shrink-0">
              👋
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-slate-900 mb-1">
                初めての方へ：まずはお試しください
              </p>
              <p className="text-sm text-slate-600">
                所要時間わずか 60秒で、あなたに最適化されたキャリア診断が完成します
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-slate-200">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-slate-900 mb-1">おすすめの使い方</p>
                <p className="text-xs md:text-sm leading-relaxed">
                  右側のフォームで「<span className="font-semibold text-sky-700">サンプル文を入れてみる</span>」を押してから送信してください。どんな診断結果が出るか一目で分かります。
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60">
                <span className="text-sm">📊</span>
                <div>
                  <Link href="/dashboard" className="font-semibold text-sky-700 hover:underline">
                    ダッシュボード
                  </Link>
                  <span className="text-slate-600"> で履歴を振り返り</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/60">
                <span className="text-sm">ℹ️</span>
                <div>
                  <Link href="/about" className="font-semibold text-sky-700 hover:underline">
                    このアプリについて
                  </Link>
                  <span className="text-slate-600"> で技術スタックを確認</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start animate-fade-in-up stagger-5">
        <div className="space-y-5">
          <div>
            <p className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <span className="text-lg">✨</span>
              このツールでできること
            </p>
            <p className="text-xs text-slate-600">
              1回の診断で、転職準備に必要なものが揃います
            </p>
          </div>
          <ul className="space-y-3">
            {[
              { icon: "🗺️", text: "スキルマップと「あなたのクラス（ジョブ）」を自動生成", color: "from-sky-500 to-indigo-500" },
              { icon: "📅", text: "30日 / 90日ロードマップと今日やることの提案", color: "from-indigo-500 to-purple-500" },
              { icon: "💼", text: "気になる求人とのマッチングスコアと不足スキルの可視化", color: "from-purple-500 to-pink-500" },
              { icon: "🎤", text: "評価面談を想定した 1on1 練習とフィードバック", color: "from-pink-500 to-rose-500" },
              { icon: "📄", text: "転職用ポートフォリオの棚卸しと Markdown 出力", color: "from-rose-500 to-orange-500" }
            ].map((item) => (
              <li key={item.text} className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 text-white text-base group-hover:scale-110 transition-transform shadow-sm`}>
                  {item.icon}
                </div>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed pt-1">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-slate-300 bg-white shadow-2xl shadow-slate-400/30 overflow-hidden animate-scale-in stagger-6">
          <div className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                ✍️
              </div>
              <span className="font-bold text-slate-900 text-sm">診断フォーム</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-xs font-semibold shadow-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              AI Ready
            </span>
          </div>
          <div className="p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-sky-50/30">
            <SkillForm />
          </div>
        </div>
      </div>
    </div>
  );
}
