import type { Castle } from "../types";
import { castlePhoto, type CastlePhoto } from "../data/castlePhotos";
import { el } from "../utils/dom";
import { castleThumbnail } from "../utils/placeholder";

/** お城カード（li 要素）を生成する。クリックで詳細モーダルを開く。 */
export function renderCastleCard(
  castle: Castle,
  onSelect: (castle: Castle) => void,
  photo: CastlePhoto | undefined = castlePhoto(castle.id)
): HTMLElement {
  const typeBadge = el("span", {
    className: "rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700",
    text: castle.type,
  });
  const badges: readonly Node[] = castle.existingTenshu
    ? [
        typeBadge,
        el("span", {
          className: "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700",
          text: "現存天守",
        }),
      ]
    : [typeBadge];

  const image = el("img", {
    className: "h-40 w-full object-cover",
    attributes: {
      src: photo?.thumbUrl ?? castleThumbnail(castle),
      alt: photo ? `${castle.name}の写真` : `${castle.name}の外観イメージ`,
      loading: "lazy",
    },
  });

  const name = el("span", {
    className: "block text-lg font-bold text-stone-900",
    text: castle.name,
  });
  const kana = el("span", {
    className: "mt-0.5 block text-xs text-stone-500",
    text: castle.kana,
  });
  const prefecture = el("span", {
    className: "mt-2 block text-sm text-stone-600",
    text: `📍 ${castle.prefecture}`,
  });
  const tags = el("div", {
    className: "mt-3 flex flex-wrap gap-1.5",
    children: castle.tags.slice(0, 3).map((tag) =>
      el("span", {
        className: "rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600",
        text: tag,
      })
    ),
  });

  const badgeRow = el("div", { className: "mb-2 flex flex-wrap gap-1.5", children: badges });
  const body = el("div", { className: "p-4", children: [badgeRow, name, kana, prefecture, tags] });
  const card = el("div", {
    className:
      "overflow-hidden bg-white shadow-sm ring-1 ring-stone-200 transition hover:shadow-md",
    children: [image, body],
  });

  const button = el("button", {
    className: "block w-full cursor-pointer text-left",
    attributes: { type: "button", "aria-label": `${castle.name}の詳細を表示` },
    children: [card],
  });
  button.addEventListener("click", () => onSelect(castle));

  return el("li", { children: [button] });
}
