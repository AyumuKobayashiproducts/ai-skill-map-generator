# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 詳細なアーキテクチャドキュメント (`docs/architecture.md`)
- 英語版 README (`README.en.md`)
- コントリビューションガイド (`CONTRIBUTING.md`)
- Issue / PR テンプレート
- インフラドキュメント (`docs/infra.md`)
- Docker Compose 設定

## [0.2.0] - 2024-12-05

### Added
- 🎤 **転職面接練習機能**
  - 3種類の面接タイプ（一般・技術・行動面接）
  - AIによる質問生成とフィードバック
  - ルールベース評価（文字数・具体性・構造・STAR要素）
  - セッション総評と履歴保存
  - 過去のスコアとの比較表示
- 初回ユーザー向けオンボーディングガイド
- 質問ごとのヒントカード
- 回答品質評価ロジック (`lib/answerEvaluator.ts`)
- 面接練習用のユニットテスト
- 面接練習用のE2Eテスト
- `interview_sessions` テーブル（履歴保存用）

### Changed
- モバイル・アクセシビリティの強化
  - タップターゲットサイズの確保（最小44px）
  - aria属性の適切な設定
  - キーボードナビゲーション対応
  - prefers-reduced-motion / prefers-contrast 対応
- usage_logs の詳細化（面接タイプ別・セッション統計）
- README の大幅更新

## [0.1.0] - 2024-12-01

### Added
- 🗺️ **スキルマップ生成**
  - 5カテゴリ（Frontend, Backend, Infra, AI, Tools）のレーダーチャート
  - 強み・弱みの言語化
- 📈 **学習ロードマップ**
  - 30日 / 90日の学習計画
- 💼 **求人マッチング**
  - 求人票とのマッチングスコア計算
  - 不足スキルTOP3の抽出
  - 求人向けミニロードマップ
- ⚠️ **キャリアリスクレーダー**
  - 陳腐化 / 属人化 / 自動化リスクの可視化
- 📋 **ポートフォリオ棚卸し**
  - 案件TOP3の自動抽出
  - Markdown / JSON エクスポート
- 🔐 **認証機能**
  - Supabase Auth によるログイン
  - 履歴ダッシュボード
- 転職準備スコア算出ロジック (`lib/readiness.ts`)
- Vitest によるユニットテスト
- Playwright による E2E テスト
- GitHub Actions による CI

---

## バージョニング方針

- **MAJOR**: 破壊的変更、大幅なUI変更
- **MINOR**: 新機能追加
- **PATCH**: バグ修正、小さな改善




