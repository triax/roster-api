# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際の Claude Code (claude.ai/code) へのガイダンスを提供します。

## 概要

Google Drive API 経由で Google スプレッドシートからチームの名簿データを取得し、JSON 形式に変換する TypeScript アプリケーションです。Google サービスアカウント認証を使用して、TRIAX チームのメンバーデータをエクスポートします。

## アーキテクチャ

このアプリケーションはシンプルなパイプラインアーキテクチャに従っています：

1. **認証** (`src/auth.ts`): サービスアカウント認証を使用した Google OAuth を処理
   - 環境変数とローカルファイル両方の認証に対応
   - API アクセスに `googleapis` ライブラリを使用

2. **ターゲット解決** (`src/target.ts`): URL から Google Drive ファイル ID を抽出
   - デフォルトターゲットは特定の Google スプレッドシートドキュメント
   - `GOOGLE_DRIVE_TARGET_FILE_URL` 環境変数で上書き可能

3. **CSV エクスポート** (`src/target.ts`): Drive API を使用して Google スプレッドシートを CSV としてエクスポート

4. **データ変換** (`src/convert.ts`): CSV を解析して構造化された JSON に変換
   - カンマを含む引用符付きフィールドを含む複雑な CSV 解析を処理
   - Google Drive 画像 URL を直接アクセス URL に変換
   - Google Drive API を使用して画像の実際の MIME タイプを検出
   - パフォーマンス最適化のためファイルメタデータをキャッシュ
   - ジャージ番号でメンバーをソート

5. **ファイル保存** (`src/save.ts`): 最終的な JSON を `data/roster.json` に書き込み

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# アプリケーションの実行（roster データを取得し JSON に変換）
npm start

# コンソールに roster データを出力しながら実行
npm run dev

# Lintチェック
npm run lint

# Lint自動修正
npm run lint:fix
```

## 環境変数

- `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`: サービスアカウント認証情報を含む JSON 文字列
- `GOOGLE_DRIVE_TARGET_FILE_URL`: デフォルトの Google スプレッドシート URL を上書き

## 主要な依存関係

- `googleapis`: Drive/Sheets アクセス用 Google API クライアント
- `tsx`: コンパイルなしの TypeScript 実行
- TypeScript: ES2019 ターゲットと Node.js モジュール解決を使用

## データフロー

1. メインエントリポイント (`main.ts`) がプロセス全体を調整
2. メンバーデータには個人情報、ポジション、写真、好みが含まれる（`src/types.ts` の `Member`、`Photo`、`RosterJSON` インターフェースを参照）
3. 出力形式は `RosterJSON` インターフェースに従い、バージョンとタイムスタンプを含む
4. 画像は Google Drive 共有 URL から直接アクセス URL に変換され、実際の MIME タイプ検出を行う
5. Photo オブジェクトには URL と MIME タイプ（例：image/jpeg、image/png、image/heif）の両方が含まれる

## GitHub Actions 自動化

このリポジトリは GitHub Actions による自動更新を実装しています：

- **毎日 JST 3:00** に自動実行
- **手動実行** も Actions タブから可能
- **自動コミット**: `data/roster.json` の変更を検出して自動コミット
- **エラー通知**: 失敗時に GitHub Issue を自動作成

### セットアップ
1. GitHub Secrets に `GOOGLE_SERVICE_ACCOUNT_KEY_JSON` を設定
2. `service-account-key.json` の内容をそのまま Secret として登録

## 備考

- サービスアカウント認証情報は環境変数またはローカルの `service-account-key.json` ファイルで提供可能
- このアプリケーションはスケジュールジョブとして実行されるよう設計されている
- データ仕様は `spec/DATA_SPEC.md` に文書化されている
- `--dump` フラグを渡すことで roster JSON をコンソールに出力可能
- CI bot として `ayanel-ci` ユーザーを使用してコミット