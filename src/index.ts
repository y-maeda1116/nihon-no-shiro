import "./style.css";
import castlesData from "./data/castles.json";
import { createCastleModal, openCastleModal } from "./components/castleModal";
import { renderCastleCard } from "./components/castleCard";
import { renderHeader } from "./components/header";
import { renderSearchFilter } from "./components/searchFilter";
import { createCastleMap } from "./components/castleMap";
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
const mapMount = document.querySelector<HTMLElement>("#castle-map");
const mapEmptyMessage = document.querySelector<HTMLElement>("#map-empty-message");
const viewListButton = document.querySelector<HTMLButtonElement>("#view-list");
const viewMapButton = document.querySelector<HTMLButtonElement>("#view-map");

if (
  !headerElement ||
  !filterMount ||
  !countMount ||
  !gridMount ||
  !emptyMessage ||
  !mapMount ||
  !mapEmptyMessage ||
  !viewListButton ||
  !viewMapButton
) {
  throw new Error("必要なマウントポイントが index.html に存在しません");
}

const modal = createCastleModal();
document.body.append(modal);

headerElement.replaceChildren(renderHeader(castles.length));

let state: FilterState = INITIAL_FILTER_STATE;
let mapView = false;

const castleMap = createCastleMap(mapMount, (selected: Castle) => openCastleModal(modal, selected));

function setViewButtons(): void {
  viewListButton!.setAttribute("aria-selected", String(!mapView));
  viewMapButton!.setAttribute("aria-selected", String(mapView));
  viewListButton!.classList.toggle("bg-stone-800", !mapView);
  viewListButton!.classList.toggle("text-white", !mapView);
  viewListButton!.classList.toggle("text-stone-600", mapView);
  viewListButton!.classList.toggle("hover:bg-stone-100", mapView);
  viewMapButton!.classList.toggle("bg-stone-800", mapView);
  viewMapButton!.classList.toggle("text-white", mapView);
  viewMapButton!.classList.toggle("text-stone-600", !mapView);
  viewMapButton!.classList.toggle("hover:bg-stone-100", !mapView);
}

function renderResults(): void {
  const results = filterCastles(castles, state);

  countMount!.textContent = `${results.length}件の城が見つかりました`;
  emptyMessage!.classList.toggle("hidden", results.length > 0);
  mapEmptyMessage!.classList.toggle("hidden", results.length > 0);
  gridMount!.replaceChildren(
    ...results.map((castle) =>
      renderCastleCard(castle, (selected: Castle) => openCastleModal(modal, selected))
    )
  );
  castleMap.update(results);
}

function setMapView(enabled: boolean): void {
  if (mapView === enabled) return;
  mapView = enabled;
  mapMount!.classList.toggle("hidden", !mapView);
  gridMount!.classList.toggle("hidden", mapView);
  setViewButtons();
  if (mapView) {
    emptyMessage!.classList.add("hidden");
    castleMap.invalidate();
    castleMap.update(filterCastles(castles, state));
  } else {
    // 空メッセージの表示は結果件数に従う（地図では常に非表示）
    emptyMessage!.classList.toggle("hidden", filterCastles(castles, state).length > 0);
  }
}

viewListButton!.addEventListener("click", () => setMapView(false));
viewMapButton!.addEventListener("click", () => setMapView(true));

filterMount.replaceChildren(
  renderSearchFilter(extractPrefectures(castles), INITIAL_FILTER_STATE, (next) => {
    state = next;
    renderResults();
  })
);

gridMount.replaceChildren(el("li", { className: "text-sm text-stone-400", text: "読み込み中…" }));
renderResults();
