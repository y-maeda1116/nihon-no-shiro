import type { CastleType } from "../types";

/** サイト表示名 */
export const SITE_NAME = "日本のお城ガイド";

/** 城の分類フィルターの選択肢 */
export const CASTLE_TYPES: readonly CastleType[] = ["平城", "平山城", "山城"];

/** 「すべて」を選択する際のセレクト値 */
export const FILTER_ALL = "all";

/** キーワード入力のデバウンス時間（ミリ秒） */
export const SEARCH_DEBOUNCE_MS = 150;
