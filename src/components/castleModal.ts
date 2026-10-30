import type { Castle } from "../types";
import { el } from "../utils/dom";
import { castleThumbnail } from "../utils/placeholder";

/** 詳細モーダル（<dialog> 1個を再利用）を作成する */
export function createCastleModal(): HTMLDialogElement {
  const dialog = el("dialog", { className: "castle-modal" });
  dialog.addEventListener("click", (event) => {
    // 背景クリックで閉じる
    if (event.target === dialog) dialog.close();
  });
  return dialog;
}

/** お城の詳細をモーダルに表示する */
export function openCastleModal(dialog: HTMLDialogElement, castle: Castle): void {
  const closeButton = el("button", {
    className:
      "absolute right-4 top-4 cursor-pointer rounded-full bg-stone-900/70 px-3 py-1.5 text-sm text-white transition hover:bg-stone-900",
    attributes: { type: "button", "aria-label": "閉じる" },
    text: "閉じる ✕",
  });
  closeButton.addEventListener("click", () => dialog.close());

  const image = el("img", {
    className: "h-44 w-full object-cover sm:h-56",
    attributes: { src: castleThumbnail(castle), alt: `${castle.name}の外観イメージ` },
  });

  const badges = el("div", {
    className: "flex flex-wrap gap-2",
    children: [
      el("span", {
        className: "rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700",
        text: castle.type,
      }),
      ...(castle.existingTenshu
        ? [
            el("span", {
              className: "rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700",
              text: "現存天守",
            }),
          ]
        : []),
      ...castle.tags.map((tag) =>
        el("span", {
          className: "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs text-amber-800",
          text: tag,
        })
      ),
    ],
  });

  const title = el("h2", {
    className: "mt-3 text-2xl font-bold text-stone-900",
    text: castle.name,
  });
  const kana = el("p", { className: "mt-1 text-sm text-stone-500", text: castle.kana });

  const summary = el("p", {
    className: "mt-4 text-sm leading-relaxed text-stone-700",
    text: castle.summary,
  });

  const infoRows: readonly [string, string][] = [
    ["築城", castle.builtYearLabel],
    ["主な城主", castle.lords.join("、")],
    ["座標", `緯度 ${castle.coordinates.lat} / 経度 ${castle.coordinates.lng}`],
  ];
  const infoList = el("dl", {
    className: "mt-4 divide-y divide-stone-200 rounded-lg bg-stone-50 px-4 py-1 text-sm",
    children: infoRows.map(([term, description]) =>
      el("div", {
        className: "flex gap-4 py-2.5",
        children: [
          el("dt", { className: "w-24 shrink-0 font-medium text-stone-500", text: term }),
          el("dd", { className: "text-stone-800", text: description }),
        ],
      })
    ),
  });

  const featureHeading = el("h3", {
    className: "mt-5 text-sm font-bold text-stone-800",
    text: "見どころ",
  });
  const featureList = el("ul", {
    className: "mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700",
    children: castle.features.map((feature) => el("li", { text: feature })),
  });

  const panel = el("div", {
    className: "relative",
    children: [
      closeButton,
      image,
      el("div", {
        className: "p-5 sm:p-6",
        children: [badges, title, kana, summary, infoList, featureHeading, featureList],
      }),
    ],
  });

  dialog.replaceChildren(panel);
  dialog.showModal();
}
