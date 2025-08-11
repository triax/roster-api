# Roster API

Google スプレッドシートからチームの名簿データを取得し、JSON 形式に変換する TypeScript アプリケーション。

## 概要

このアプリケーションは、サービスアカウント認証を使用して Google Drive API に接続し、Google スプレッドシートからチームの名簿データをエクスポートして構造化された JSON 形式に変換します。また、Google Drive に保存されているすべての画像の MIME タイプを検出して含めます。

## 前提条件

- Node.js と npm がインストールされていること
- ターゲットの Google スプレッドシートドキュメントへのアクセス権を持つ Google サービスアカウント認証情報

## インストール

```bash
npm install
```

## 設定

### 認証

Google サービスアカウント認証情報は、以下のいずれかの方法で提供します：

1. 環境変数:
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_KEY_JSON='{"type":"service_account",...}'
   ```

2. ローカルファイル:
   プロジェクトルートに `service-account-key.json` を作成

### ターゲットスプレッドシート

カスタム Google スプレッドシート URL を設定（オプション）:
```bash
export GOOGLE_DRIVE_TARGET_FILE_URL='https://docs.google.com/spreadsheets/d/YOUR_FILE_ID'
```

## 使用方法

```bash
# 名簿データを取得して data/roster.json に保存
npm start

# 名簿データを取得してコンソールに出力
npm run dev

# dump フラグ付きで実行
npm start -- --dump
```

## 出力

アプリケーションは以下の構造で `data/roster.json` を生成します：

```json
{
  "version": "1.0",
  "updated_at": "2025-01-01T00:00:00.000Z",
  "members": [
    {
      "timestamp": "2025-01-01T00:00:00.000Z",
      "name": {
        "default": "選手名",
        "hiragana": "せんしゅめい",
        "alphabet": "Player Name"
      },
      "position": "QB",
      "jersey": 1,
      "next_introduction": "紹介文",
      "role": "チーム内での役割",
      "photos": {
        "serious": {
          "url": "https://drive.usercontent.google.com/...",
          "mime_type": "image/jpeg"
        },
        "casual": [
          {
            "url": "https://drive.usercontent.google.com/...",
            "mime_type": "image/png"
          }
        ]
      },
      "university": "大学名",
      "enthusiasm": "選手の意気込み",
      "watchme": "注目ポイント",
      "hobbies": "趣味",
      "favorite": "好きなもの",
      "gifts": "プレゼントの好み",
      "what_i_like_about_triax": "チームの好きなところ"
    }
  ]
}
```

## GitHub Actions 自動化

このリポジトリは GitHub Actions による名簿データの自動更新を実装しています。

### 自動更新

ワークフロー (`.github/workflows/update-roster.yml`) は以下のタイミングで実行されます：
- **毎日午前 3:00 (JST)**
- **手動実行** - GitHub Actions UI から workflow_dispatch で実行
- **プッシュ時** - main ブランチのソースファイル変更時

### セットアップ手順

1. **GitHub Secrets にサービスアカウント認証情報を追加:**
   
   a. `service-account-key.json` から サービスアカウント JSON を取得
   b. リポジトリの Settings → Secrets and variables → Actions へ移動
   c. 「New repository secret」をクリック
   d. 名前: `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`
   e. 値: サービスアカウントキーファイルの JSON 内容全体をペースト
   f. 「Add secret」をクリック

2. **手動実行:**
   
   - Actions タブ → 「Update Roster Data」ワークフロー
   - 「Run workflow」をクリック → ブランチを選択 → 実行

3. **実行監視:**
   
   - Actions タブでワークフローのステータスを確認
   - 失敗時は自動的に GitHub Issue が作成されて通知

### 機能

- `data/roster.json` の更新を自動コミット
- データ変更がない場合はコミットをスキップ
- GitHub Issues によるエラー通知
- GitHub Secrets による安全な認証情報管理

## 機能

- Drive API 経由で Google スプレッドシートから名簿データを取得
- CSV データを構造化された JSON 形式に変換
- 画像の実際の MIME タイプを検出（例：image/jpeg、image/png、image/heif）
- Google Drive 共有 URL を直接アクセス URL に変換
- パフォーマンス向上のためメタデータをキャッシュ
- ジャージ番号でメンバーをソート

## 開発

- TypeScript（ES2019 ターゲット）
- 直接 TypeScript 実行に `tsx` を使用
- Drive/Sheets アクセスに Google APIs SDK を使用

## ライセンス

MIT