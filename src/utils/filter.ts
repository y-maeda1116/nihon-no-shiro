import { FILTER_ALL } from "../config";
import type { Castle } from "../types";

/** 検索・フィルターの入力状態 */
export interface FilterState {
  /** キーワード（名前・読み仮名・都道府県・城主・タグを部分一致検索） */
  readonly keyword: string;
  /** 都道府県（FILTER_ALL または都道府県名） */
  readonly prefecture: string;
  /** 城の分類（FILTER_ALL または CastleType） */
  readonly type: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  keyword: "",
  prefecture: FILTER_ALL,
  type: FILTER_ALL,
};

/** カタカナをひらがなに変換し、大文字小文字を揃えて検索用に正規化する */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .trim();
}

function matchesKeyword(castle: Castle, keyword: string): boolean {
  const normalized = normalize(keyword);
  if (normalized === "") return true;
  const haystacks: readonly string[] = [
    castle.name,
    castle.kana,
    castle.prefecture,
    castle.type,
    ...castle.lords,
    ...castle.tags,
  ];
  return haystacks.some((text) => normalize(text).includes(normalized));
}

/** 検索条件にお城の一覧を絞り込む */
export function filterCastles(castles: readonly Castle[], state: FilterState): readonly Castle[] {
  return castles.filter(
    (castle) =>
      matchesKeyword(castle, state.keyword) &&
      (state.prefecture === FILTER_ALL || castle.prefecture === state.prefecture) &&
      (state.type === FILTER_ALL || castle.type === state.type)
  );
}

/** セレクトボックス用にデータから都道府県の一覧を作る（重複排除・五十音順） */
export function extractPrefectures(castles: readonly Castle[]): readonly string[] {
  const unique = new Set(castles.map((castle) => castle.prefecture));
  return [...unique].sort((a, b) => a.localeCompare(b, "ja"));
}
