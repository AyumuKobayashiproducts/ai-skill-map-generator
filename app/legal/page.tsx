import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const sections = [
  {
    id: "provision",
    icon: "📱",
    title: "提供形態",
    content: "本アプリは個人開発によるものであり、営利目的の有償サービスではありません。予告なく仕様変更や停止を行う場合があります。"
  },
  {
    id: "data",
    icon: "🗄️",
    title: "データの取り扱い",
    items: [
      "入力されたスキル・職務経歴などの情報は Supabase（Postgres）に保存されます。",
      "これらの情報は、開発者による動作検証・改善のために参照する場合があります。",
      "第三者への販売・共有は行いませんが、技術的なログや統計として匿名で扱う場合があります。",
      "アカウント削除を行うことで、本アプリ上に保存されたスキルマップや利用ログを削除できます。"
    ]
  },
  {
    id: "disclaimer",
    icon: "⚠️",
    title: "免責事項",
    items: [
      "本アプリの分析結果やスコアは、あくまで参考情報であり、転職活動の結果を保証するものではありません。",
      "障害・バグ・サービス停止などにより生じたいかなる損害についても、開発者は責任を負いかねます。"
    ]
  },
  {
    id: "contact",
    icon: "💬",
    title: "お問い合わせ",
    content: "本アプリに関するご質問や不具合の報告は、GitHub リポジトリの Issues からご連絡いただけると助かります。"
  }
];

export default function LegalPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center text-white text-2xl shadow-lg">
            📜
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              利用について
            </h2>
            <p className="text-sm text-slate-500">
              AI Skill Map Generator の利用規約と注意事項
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-700 leading-relaxed max-w-2xl">
          AI Skill Map Generator は、開発者本人のポートフォリオ用として公開しているデモアプリです。
          実際の転職活動で利用する場合の前提や注意点を、以下にまとめています。
        </p>
      </header>

      {/* Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, idx) => (
          <Card 
            key={section.id} 
            className="card-hover animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  {section.icon}
                </span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-1">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 animate-fade-in-up stagger-4">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">関連リンク</p>
                <p className="text-xs text-slate-500">アカウント管理やお問い合わせ</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/auth/delete"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>🗑️</span>
                アカウント削除
              </Link>
              <a
                href="https://github.com/hashimotonobuaki123-cmyk/ai-skill-map-generator/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800 transition-colors"
              >
                <span>🐙</span>
                GitHub Issues
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
