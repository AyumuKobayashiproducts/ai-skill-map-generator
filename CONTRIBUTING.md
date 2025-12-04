# Contributing Guide / コントリビューションガイド

このプロジェクトへの貢献に興味を持っていただきありがとうございます！

## 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm 9.0.0 以上

### セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/hashimotonobuaki123-cmyk/ai-skill-map-generator.git
cd ai-skill-map-generator

# 依存関係をインストール
npm install --legacy-peer-deps

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して必要な API キーを設定

# 開発サーバーを起動
npm run dev
```

## 開発ワークフロー

### ブランチ戦略

- `main`: 本番環境用のブランチ
- `feature/*`: 新機能開発用
- `fix/*`: バグ修正用
- `docs/*`: ドキュメント更新用

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

```
feat: 新機能を追加
fix: バグを修正
docs: ドキュメントを更新
style: コードフォーマットを修正
refactor: リファクタリング
test: テストを追加/修正
chore: ビルドプロセスやツールの変更
```

### コード品質チェック

プルリクエストを送る前に、以下のコマンドを実行してください：

```bash
# 型チェック
npm run type-check

# Lintチェック
npm run lint

# フォーマットチェック
npm run format:check

# テスト
npm run test

# すべてのチェックを一括実行
npm run validate
```

## プルリクエスト

1. フォークしてブランチを作成
2. 変更を実装
3. テストを追加/更新
4. `npm run validate` が通ることを確認
5. プルリクエストを作成

### プルリクエストのテンプレート

```markdown
## 概要
変更内容の簡潔な説明

## 変更点
- 変更点1
- 変更点2

## テスト
- [ ] 型チェック通過
- [ ] Lint通過
- [ ] テスト通過

## スクリーンショット（UIの変更がある場合）
```

## コーディング規約

### TypeScript

- `strict` モードを使用
- 明示的な型定義を推奨
- `any` の使用は最小限に

### React

- 関数コンポーネントを使用
- フックを適切に使用
- コンポーネントは小さく保つ

### テスト

- ユニットテストは `*.test.ts(x)` で作成
- E2Eテストは `tests/e2e/` に配置

## 質問・サポート

質問やサポートが必要な場合は、GitHub Issues で気軽にお問い合わせください。

