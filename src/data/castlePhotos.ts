import photoData from "./castle-photos.json";

/** Wikimedia Commons から取得した城の写真（出典・ライセンス情報付き） */
export interface CastlePhoto {
  /** 元になった Wikipedia 記事名 */
  readonly article: string;
  /** 画像ファイル名（「File:」接頭辞なし） */
  readonly file: string;
  /** サムネイル画像の URL（Wikimedia のホットリンク） */
  readonly thumbUrl: string;
  /** Commons 上のファイル説明ページ（出典リンク先） */
  readonly sourceUrl: string;
  /** ライセンスの短縮名（例: CC BY-SA 4.0, Public domain） */
  readonly license: string;
  /** 著作者の表示名 */
  readonly author: string;
}

const photos = new Map<string, CastlePhoto>(
  Object.entries(photoData as Readonly<Record<string, CastlePhoto>>)
);

/** 城IDに対応する写真情報を返す（未収録の城は undefined） */
export function castlePhoto(id: string): CastlePhoto | undefined {
  return photos.get(id);
}
