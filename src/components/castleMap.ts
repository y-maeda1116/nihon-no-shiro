import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Castle } from "../types";

const JAPAN_CENTER: [number, number] = [36.5, 138];
const JAPAN_ZOOM = 5;
const SINGLE_MARKER_ZOOM = 13;
const FIT_PADDING_PX = 48;

/** 城ごとのマーカーアイコン（絵文字を丸で囲んだ divIcon） */
function castleIcon(castle: Castle): L.DivIcon {
  const existing = castle.existingTenshu;
  return L.divIcon({
    className: "castle-marker",
    html: `<span class="castle-marker-pin${existing ? " castle-marker-pin--existing" : ""}">${
      existing ? "🏯" : "⛩"
    }</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    tooltipAnchor: [0, -24],
  });
}

export interface CastleMap {
  /** 絞り込み結果に合わせてマーカーを再描画し、表示範囲を調整する */
  update(castles: readonly Castle[]): void;
  /** 非表示から表示に切り替わった直後のサイズ再計算 */
  invalidate(): void;
}

/**
 * Leaflet 地図を作成する。タイルは OpenStreetMap を利用する。
 * 絞り込み結果のマーカーを表示し、クリックで詳細モーダルを開く。
 */
export function createCastleMap(
  container: HTMLElement,
  onSelect: (castle: Castle) => void
): CastleMap {
  const map = L.map(container, {
    center: JAPAN_CENTER,
    zoom: JAPAN_ZOOM,
    scrollWheelZoom: true,
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  const markerLayer = L.layerGroup().addTo(map);

  function update(castles: readonly Castle[]): void {
    markerLayer.clearLayers();
    for (const castle of castles) {
      L.marker([castle.coordinates.lat, castle.coordinates.lng], {
        icon: castleIcon(castle),
        title: castle.name,
        alt: `${castle.name}の位置`,
      })
        .bindTooltip(castle.name, { direction: "top", offset: [0, -4] })
        .on("click", () => onSelect(castle))
        .addTo(markerLayer);
    }

    if (castles.length === 0) {
      map.setView(JAPAN_CENTER, JAPAN_ZOOM);
      return;
    }
    if (castles.length === 1) {
      const { lat, lng } = castles[0]!.coordinates;
      map.setView([lat, lng], SINGLE_MARKER_ZOOM);
      return;
    }
    map.fitBounds(L.latLngBounds(castles.map((c) => [c.coordinates.lat, c.coordinates.lng])), {
      padding: [FIT_PADDING_PX, FIT_PADDING_PX],
    });
  }

  function invalidate(): void {
    map.invalidateSize();
  }

  return { update, invalidate };
}
