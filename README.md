# 日本のお城ガイド (nihon-no-shiro)

現存12天守を中心とした日本の名城を、一覧・検索・詳細確認できる静的 Web アプリケーションです。

- **用途**: 日本のお城情報の閲覧・キーワード検索・都道府県/分類での絞り込み
- **ホスティング**: GitHub Pages（`https://y-maeda1116.github.io/nihon-no-shiro/`）
- **データ**: `src/data/castles.json` に現存12天守 + 名古屋城・大阪城・二条城・首里城の17城を掲載

## 機能

| 機能 | 説明 |
|------|------|
| 一覧表示 | カード型グリッドレイアウト（レスポンシブ、モバイル1列 / PC3列） |
| キーワード検索 | 城名・読み仮名・都道府県・城主・タグの部分一致（デバウンス付き） |
| 絞り込み | 都道府県別・城の分類（平城 / 平山城 / 山城）別 |
| 詳細モーダル | 解説・築城年・主な城主・見どころ・座標を `<dialog>` で表示 |

## 技術スタック

- TypeScript 7（`@typescript/native`、テンプレートの side-by-side 構成を踏襲）
- Vite 8 + Tailwind CSS v4（`@tailwindcss/vite` プラグイン）
- Vitest（フィルターロジックとデータ整合性のユニットテスト）
- GitHub Actions（CI + GitHub Pages デプロイ、アクションはコミット SHA ピン留め）

## 開発

```bash
npm install
npm run dev        # 開発サーバー
npm run build      # 本番ビルド (dist/)
npm run preview    # ビルド結果のプレビュー
npm test           # ユニットテスト
npm run typecheck  # 型チェック (TS 7 tsc)
npm run lint       # ESLint
```

## GitHub Pages へのデプロイ

`main` ブランチへの push（または手動実行）で `.github/workflows/deploy.yml` が走り、`dist/` を GitHub Pages へデプロイします。

初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source を「GitHub Actions」** に変更してください。

## データについて

- 城の分類（平城/平山城/山城）・年代・城主には諸説あります。掲載内容は代表的な説に基づきます
- サムネイルは外部画像に依存しない SVG プレースホルダー（`src/utils/placeholder.ts`）で生成しています
- データ追加は `src/data/castles.json` に項目を足すだけです（スキーマは `src/types.ts`）
