import { CASTLE_TYPES, FILTER_ALL, SEARCH_DEBOUNCE_MS } from "../config";
import type { FilterState } from "../utils/filter";
import { el } from "../utils/dom";

/** 検索・フィルター UI（キーワード入力 + 都道府県/分類セレクト + リセット）を生成する */
export function renderSearchFilter(
  prefectures: readonly string[],
  initial: FilterState,
  onChange: (next: FilterState) => void
): HTMLElement {
  const state: { current: FilterState } = { current: initial };

  const keywordInput = el("input", {
    className:
      "w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300",
    attributes: {
      type: "search",
      placeholder: "城名・読み仮名・都道府県・城主・タグで検索",
      "aria-label": "キーワード検索",
    },
  });

  const prefectureSelect = el("select", {
    className:
      "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300",
    attributes: { "aria-label": "都道府県で絞り込み" },
  });
  prefectureSelect.append(
    el("option", { text: "すべての都道府県", attributes: { value: FILTER_ALL } }),
    ...prefectures.map((prefecture) =>
      el("option", { text: prefecture, attributes: { value: prefecture } })
    )
  );

  const typeSelect = el("select", {
    className:
      "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300",
    attributes: { "aria-label": "城の分類で絞り込み" },
  });
  typeSelect.append(
    el("option", { text: "すべての分類", attributes: { value: FILTER_ALL } }),
    ...CASTLE_TYPES.map((type) => el("option", { text: type, attributes: { value: type } }))
  );

  const resetButton = el("button", {
    className:
      "cursor-pointer rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-600 transition hover:bg-stone-100",
    attributes: { type: "button" },
    text: "リセット",
  });

  const emit = (): void => onChange(state.current);
  const update = (patch: Partial<FilterState>): void => {
    state.current = { ...state.current, ...patch };
    emit();
  };

  let debounceTimer: number | undefined;
  keywordInput.addEventListener("input", () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(
      () => update({ keyword: keywordInput.value }),
      SEARCH_DEBOUNCE_MS
    );
  });
  prefectureSelect.addEventListener("change", () => update({ prefecture: prefectureSelect.value }));
  typeSelect.addEventListener("change", () => update({ type: typeSelect.value }));
  resetButton.addEventListener("click", () => {
    window.clearTimeout(debounceTimer);
    keywordInput.value = initial.keyword;
    prefectureSelect.value = initial.prefecture;
    typeSelect.value = initial.type;
    state.current = initial;
    emit();
  });

  const keywordField = el("div", {
    className: "sm:col-span-2 lg:col-span-3",
    children: [keywordInput],
  });
  const grid = el("div", {
    className: "grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4",
    children: [keywordField, prefectureSelect, typeSelect, resetButton],
  });

  return el("div", {
    className: "rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:p-5",
    children: [grid],
  });
}
