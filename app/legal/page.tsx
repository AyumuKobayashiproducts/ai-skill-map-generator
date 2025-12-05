export default function LegalPage() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">このサイトの利用について</h2>
        <p className="text-xs text-muted-foreground">
          AI Skill Map Generator は、開発者本人のポートフォリオ用として公開しているデモアプリです。
          実際の転職活動で利用する場合の前提や注意点を、簡易的にまとめています。
        </p>
      </header>

      <section className="space-y-1.5">
        <h3 className="text-sm font-semibold">1. 提供形態</h3>
        <p>
          本アプリは個人開発によるものであり、営利目的の有償サービスではありません。
          予告なく仕様変更や停止を行う場合があります。
        </p>
      </section>

      <section className="space-y-1.5">
        <h3 className="text-sm font-semibold">2. データの取り扱い</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>入力されたスキル・職務経歴などの情報は Supabase（Postgres）に保存されます。</li>
          <li>これらの情報は、開発者による動作検証・改善のために参照する場合があります。</li>
          <li>第三者への販売・共有は行いませんが、技術的なログや統計として匿名で扱う場合があります。</li>
          <li>
            `/auth/delete` からアカウント削除を行うことで、本アプリ上に保存されたスキルマップや利用ログを削除できます。
          </li>
        </ul>
      </section>

      <section className="space-y-1.5">
        <h3 className="text-sm font-semibold">3. 免責事項</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            本アプリの分析結果やスコアは、あくまで参考情報であり、転職活動の結果を保証するものではありません。
          </li>
          <li>
            障害・バグ・サービス停止などにより生じたいかなる損害についても、開発者は責任を負いかねます。
          </li>
        </ul>
      </section>

      <section className="space-y-1.5">
        <h3 className="text-sm font-semibold">4. お問い合わせ</h3>
        <p className="text-xs text-muted-foreground">
          本アプリに関するご質問や不具合の報告は、GitHub リポジトリの Issues
          からご連絡いただけると助かります。
        </p>
      </section>
    </div>
  );
}


