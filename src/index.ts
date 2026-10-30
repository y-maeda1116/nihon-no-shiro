import "./style.css";
import castlesData from "./data/castles.json";
import { createCastleModal, openCastleModal } from "./components/castleModal";
import { renderCastleCard } from "./components/castleCard";
import { renderHeader } from "./components/header";
import { renderSearchFilter } from "./components/searchFilter";
import {
  INITIAL_FILTER_STATE,
  type FilterState,
  extractPrefectures,
  filterCastles,
} from "./utils/filter";
import { el } from "./utils/dom";
import type { Castle } from "./types";

const castles = castlesData as readonly Castle[];

const headerElement = document.querySelector("header");
const filterMount = document.querySelector<HTMLElement>("#search-filter");
const countMount = document.querySelector<HTMLElement>("#result-count");
const gridMount = document.querySelector<HTMLElement>("#castle-grid");
const emptyMessage = document.querySelector<HTMLElement>("#empty-message");

if (!headerElement || !filterMount || !countMount || !gridMount || !emptyMessage) {
  throw new Error("必要なマウントポイントが index.html に存在しません");
}

const modal = createCastleModal();
document.body.append(modal);

headerElement.replaceChildren(renderHeader(castles.length));

let state: FilterState = INITIAL_FILTER_STATE;

function renderResults(): void {
  const results = filterCastles(castles, state);

  countMount!.textContent = `${results.length}件の城が見つかりました`;
  emptyMessage!.classList.toggle("hidden", results.length > 0);
  gridMount!.replaceChildren(
    ...results.map((castle) =>
      renderCastleCard(castle, (selected: Castle) => openCastleModal(modal, selected))
    )
  );
}

filterMount.replaceChildren(
  renderSearchFilter(extractPrefectures(castles), INITIAL_FILTER_STATE, (next) => {
    state = next;
    renderResults();
  })
);

gridMount.replaceChildren(el("li", { className: "text-sm text-stone-400", text: "読み込み中…" }));
renderResults();
