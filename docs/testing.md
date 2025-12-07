# テスト戦略・品質管理ポリシー

このプロジェクトでは、「AI による診断結果を安心して参考にできること」と「将来の機能追加に強いコードベース」をゴールに、次のようなテスト戦略を取っています。

## テストの種類

| 種類 | ツール | 対象 | 目的 |
|------|--------|------|------|
| ユニットテスト | Vitest | `lib/` のスコア計算・回答評価ロジック・APIクライアント | ビジネスロジックが仕様通り・境界値でも壊れないことを保証する |
| カスタムフックテスト | Vitest + Testing Library | `hooks/useDebounce` など | UI ロジック（デバウンス等）が意図したタイミングで動くことを確認する |
| E2Eテスト | Playwright | 診断フロー・スクリーンショット取得 | ホーム → 入力 → 結果表示までの主要シナリオがブラウザ上で動くことを確認する |

## 機能別のテスト観点

| 機能 / 画面 | 主なテスト手段 | 観点 |
|-------------|----------------|------|
| スキル診断（/api/generate, Home → Result） | Vitest（`readiness.ts` 等） + Playwright | 入力バリデーション、診断完了までの遷移、結果タブの表示、i18n 文言切替 |
| ダッシュボード（`/dashboard`） | Playwright | 診断履歴の表示、空状態の UI、1on1 セッション履歴カードの表示・リンク |
| 1on1 練習モード（questions / feedback / summary / sessions） | Vitest（`answerEvaluator`） + 手動 / 将来の E2E 対象 | ルールベーススコアの計算、AI フィードバック API のエラー処理、履歴保存／読み出し |
| Job Match / Career Risk | 手動 + 将来の E2E 対象 | スキルマップとの連携、API エラー時の UI、スコア表示ロジック |
| Today Task / Time Simulator | 手動 + 将来のユニットテスト候補 | 学習時間パラメータの扱い、AI から返ってくるプランの整形と表示 |
| ポートフォリオ生成 / ストーリー生成 | 手動 + 将来の E2E 対象 | 入力項目の検証、AI 失敗時のエラーメッセージ、コピー機能 |
| i18n（`next-intl`） | Playwright（`tests/e2e/i18n.spec.ts`） | `/ja` と `/en` で UI テキスト・URL が正しく切り替わること |

## カバレッジ方針

- Vitest のカバレッジ対象を **`lib/` と `hooks/`** に絞り、ドメインロジックと UI ロジックの品質を重点的に可視化しています。
- `npm run test:coverage` 実行時に、`coverage/` 以下に v8 カバレッジレポート（text / json / html）を生成します。
- 現時点では **lib 配下は 60% 超、全体ではおよそ 50% 程度** を確保しており、今後もロジック追加時にテストを増やしていく想定です。

## CI との連携

- GitHub Actions（`.github/workflows/ci.yml`）で、Pull Request ごとに以下を自動実行します。
  - `npm run type-check`（TypeScript の型チェック）
  - `npm run lint`（ESLint）
  - `npm run build`（Next.js ビルド）
  - `npm run test:coverage`（Vitest のカバレッジ付きテスト）
  - `npm run test:e2e`（Playwright による E2E テスト）
- テスト実行後、次の成果物を **Artifacts としてアップロード**し、必要に応じてダウンロードして確認できるようにしています。
  - `coverage/` ディレクトリ（ユニットテストの HTML レポートなど）
  - `test-results/` ディレクトリ（Playwright のスクリーンショットやトレース）

## 今後の拡張余地

- `lib/` 以外の API Route（`app/api/**`）に対するユニットテスト・統合テストの追加
- Playwright テストで、主要な結果画面（スキルマップ・求人マッチング・1on1 練習）のスクリーンショットを CI から自動取得して保存する仕組み（`npm run screenshot` で取得する E2E スクリーンショットを「簡易 UI スナップショット」として扱う運用）
- 重要なバグ修正や仕様変更時に、回帰テスト用のテストケースを増やしていく運用


