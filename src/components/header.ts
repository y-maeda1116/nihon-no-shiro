import { SITE_NAME } from "../config";
import { el } from "../utils/dom";

/** ページヘッダーを生成する */
export function renderHeader(totalCount: number): HTMLElement {
  const title = el("h1", {
    className: "text-3xl font-bold tracking-wide text-stone-50 sm:text-4xl",
    text: "🏯 " + SITE_NAME,
  });
  const description = el("p", {
    className: "mt-2 text-sm text-stone-200 sm:text-base",
    text: "現存12天守を中心とした日本の名城を一覧・検索できます。",
  });
  const count = el("p", {
    className:
      "mt-3 inline-block rounded-full bg-stone-50/15 px-3 py-1 text-xs font-medium text-stone-100",
    text: `掲載城数: ${totalCount}城`,
  });

  return el("div", {
    className: "mx-auto max-w-5xl px-4 py-10 sm:py-14",
    children: [title, description, count],
  });
}
