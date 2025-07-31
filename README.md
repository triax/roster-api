# TRIAX ロースター API

TRIAX アメリカンフットボールチームのロースターデータにアクセスするための Google Apps Script ベースの REST API です。

## 概要

このAPIは、チームメンバーの情報（選手の詳細、ポジション、写真、個人情報など）へのアクセスを提供します。Google スプレッドシートからデータを読み取り、フィルタリングとフィールド選択をサポートする JSON レスポンスを返します。

## API エンドポイント

### メンバー一覧取得
```
GET /members
```

全チームメンバーのリストを返します。

**クエリパラメータ:**
- `position` - ポジションでフィルタリング（例：`WR`, `DB`, `RB`, `OL`, `DL`, `LB`, `QB`, `Staff`）
- `fields` - 返すフィールドをカンマ区切りで指定（例：`name,position,jersey`）
- `thumbnails` - `true` に設定すると画像のサムネイル版を返す

**例:**
```
/members?position=WR&fields=name,position,photos&thumbnails=true
```

### ポジション一覧取得
```
GET /positions
```

ロースターで利用可能な全ポジションのリストを返します。

## レスポンス形式

### 成功時のレスポンス
```json
{
  "success": true,
  "data": [...],
  "count": 42
}
```

### エラー時のレスポンス
```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## データモデル

### Member オブジェクト
```typescript
{
  timestamp: string;
  name: {
    default: string;    // 日本語名
    hiragana: string;   // ひらがな読み
    alphabet: string;   // アルファベット表記
  };
  position: string;     // ポジション
  jersey?: string;      // 背番号
  height?: string;      // 身長（cm）
  weight?: string;      // 体重（kg）
  birthdate?: string;   // 生年月日
  next_introduction: string;
  role: string;         // チーム内での役割
  photos: {
    serious: string;    // 真面目な写真のURL
    casual: string[];   // カジュアルな写真のURL
  };
  workplace?: string;   // 勤務先
  university: string;   // 出身校
  enthusiasm: string;   // 今シーズンの意気込み
  watchme: string;      // ここを見てくれ
  hobbies: string;      // 趣味
  favorite: string;     // 最近の推し
  gifts: string;        // ファンからの差し入れ
  what_i_like_about_triax: string;  // TRIAXの好きなところ
}
```

## 開発

### 前提条件
- Node.js 18+
- npm
- Apps Script へのアクセス権を持つ Google アカウント
- CLASP CLI (`npm install -g @google/clasp`)

### セットアップ
1. リポジトリをクローン
2. 依存関係をインストール:
   ```bash
   npm install
   ```
3. CLASP にログイン:
   ```bash
   npx clasp login
   ```
4. セットアップスクリプトを実行:
   ```bash
   npm run setup
   ```

### 開発用コマンド

- `npm run build` - TypeScript を JavaScript にコンパイル
- `npm run lint` - ESLint でコード品質をチェック
- `npm run lint:fix` - リンティング問題を自動修正
- `npm run format` - Prettier でコードをフォーマット
- `npm run push` - ビルドして Google Apps Script にプッシュ
- `npm run deploy` - 新しいデプロイメントを作成
- `npm run release` - プッシュとデプロイを一度に実行
- `npm run test:local` - サンプルデータでローカルテストサーバーを起動

### ローカルテスト

プロジェクトには CSV データを使用して API をシミュレートするローカルテストサーバーが含まれています：

```bash
npm run test:local
```

これにより、本番 API と同じエンドポイントを持つローカルサーバーが `http://localhost:3000` で起動します。

### プロジェクト構造

```
├── src/                    # Google Apps Script ソースファイル
│   ├── Code.ts            # メイン API 実装
│   └── appsscript.json    # GAS マニフェスト
├── scripts/               # 開発ツール
│   ├── deploy.ts          # デプロイメント自動化
│   ├── localTestServer.ts # ローカルテストサーバー
│   └── setup.ts           # 初期セットアップ
├── dist/                  # コンパイル済み出力（git無視）
├── data/                  # CSV テストデータ（git無視）
└── spec/                  # データ仕様書
```

## デプロイメント

### 手動デプロイメント
```bash
npm run release
```

このコマンドは以下を実行します：
1. TypeScript ファイルをビルド
2. Google Apps Script にプッシュ
3. タイムスタンプ付きの新しいデプロイメントを作成

### デプロイメント URL 形式
デプロイメント URL は以下のパターンに従います：
```
https://script.google.com/macros/s/AKfycb.../exec
```

デプロイメント ID は常に `AKfycb` で始まります。

## 設定

### Google Apps Script 設定
API は `src/appsscript.json` で設定されています：
- **ランタイム**: V8
- **タイムゾーン**: Asia/Tokyo
- **アクセス**: パブリック（匿名）
- **実行**: デプロイしたユーザーとして

### TypeScript 設定
- **ターゲット**: ES2019（V8 ランタイムに合わせる）
- **モジュール**: なし（GAS はグローバルスコープを使用）
- **出力**: `dist/` ディレクトリ

## コントリビューション

1. フィーチャーブランチを作成
2. 変更を加える
3. リンティングを実行: `npm run lint`
4. ローカルでテスト: `npm run test:local`
5. プルリクエストを送信

## ライセンス

MIT