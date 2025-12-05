# Contributing to AI Skill Map Generator

このプロジェクトへの貢献を検討いただき、ありがとうございます！  
以下のガイドラインに沿ってコントリビューションをお願いします。

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-username/ai-skill-map-generator.git
cd ai-skill-map-generator

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して Supabase と OpenAI の API キーを設定

# 開発サーバーを起動
npm run dev
```

## Issue を立てる

新しい機能のリクエストやバグ報告は、まず Issue を立ててください。

### Issue の種類

- **🐛 Bug report**: バグの報告
- **✨ Feature request**: 新機能のリクエスト
- **📚 Documentation**: ドキュメントの改善
- **💬 Question**: 質問や相談

### Issue 作成時のポイント

1. **既存の Issue を確認**: 同様の Issue がないか確認してください
2. **テンプレートを使用**: Issue テンプレートに沿って記載してください
3. **再現手順を明記**: バグの場合は再現手順を詳しく書いてください

## Pull Request

### ブランチ戦略

```
main
  └── feature/xxx   # 機能追加
  └── fix/xxx       # バグ修正
  └── docs/xxx      # ドキュメント
  └── refactor/xxx  # リファクタリング
```

### PR の作成手順

1. **Issue を確認または作成**
   - 対応する Issue がない場合は、まず Issue を立ててください

2. **ブランチを作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **変更を実装**
   - コードスタイルはプロジェクトの既存コードに従ってください
   - TypeScript の型を適切に定義してください

4. **テストを実行**
   ```bash
   npm run lint          # Lint チェック
   npm run test          # ユニットテスト
   npm run build         # ビルド確認
   ```

5. **コミット**
   ```bash
   git commit -m "feat: 新機能の説明"
   ```

   コミットメッセージの形式:
   - `feat:` 新機能
   - `fix:` バグ修正
   - `docs:` ドキュメント
   - `refactor:` リファクタリング
   - `test:` テスト追加・修正
   - `chore:` その他（依存関係更新など）

6. **PR を作成**
   - PR テンプレートに沿って記載してください
   - Issue 番号を紐付けてください（`Closes #123`）

### コードレビュー

- レビュアーからのフィードバックには丁寧に対応してください
- 大きな変更の場合は、事前に設計について相談してください

## コーディング規約

### TypeScript

- 厳密な型定義を心がけてください
- `any` の使用は避けてください
- API の入力は Zod スキーマでバリデーションしてください

### React / Next.js

- コンポーネントは関数コンポーネントで記述してください
- Client Component には `"use client"` ディレクティブを付けてください
- 状態管理は React の標準 hooks を使用してください

### スタイリング

- Tailwind CSS を使用してください
- カスタム CSS は最小限に留めてください

### テスト

- 新機能には対応するテストを追加してください
- ビジネスロジック（`lib/`）はユニットテストを書いてください
- UI の重要なフローは E2E テストでカバーしてください

## Good First Issues

初めてのコントリビューションには、`good first issue` ラベルの付いた Issue がおすすめです。

- 比較的小さな変更
- コードベースの理解を深めるのに適した内容
- メンテナーからのサポートを受けやすい

## 質問・相談

- Issue のコメントや Discussion でお気軽にどうぞ
- 設計に関する大きな変更は、事前に相談してください

## ライセンス

このプロジェクトに貢献することで、あなたの貢献が MIT ライセンスの下で公開されることに同意したものとみなされます。

---

ご協力ありがとうございます！ 🙏

