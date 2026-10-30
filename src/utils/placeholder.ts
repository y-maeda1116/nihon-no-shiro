import type { Castle } from "../types";

interface Palette {
  readonly skyTop: string;
  readonly skyBottom: string;
  readonly silhouette: string;
}

/** 城の分類ごとのサムネイル配色 */
const PALETTES: Record<string, Palette> = {
  平城: { skyTop: "#fdeecd", skyBottom: "#f0b060", silhouette: "#4a3421" },
  平山城: { skyTop: "#e3f2e1", skyBottom: "#8fb98a", silhouette: "#26382a" },
  山城: { skyTop: "#dfeafa", skyBottom: "#7b9cc9", silhouette: "#22303f" },
};

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * 外部画像に依存しないプレースホルダー SVG の data URI を生成する。
 * 空のグラデーション + 天守シルエット + 城名を描画する。
 */
export function castleThumbnail(castle: Castle): string {
  const palette = PALETTES[castle.type] ?? PALETTES["平城"];
  const s = palette.silhouette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" role="img" aria-label="${escapeXml(castle.name)}">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${palette.skyTop}"/><stop offset="1" stop-color="${palette.skyBottom}"/>
</linearGradient></defs>
<rect width="400" height="240" fill="url(#sky)"/>
<circle cx="330" cy="48" r="22" fill="#ffffff" opacity="0.55"/>
<g fill="${s}">
<rect x="60" y="190" width="280" height="14" rx="3"/>
<rect x="140" y="138" width="120" height="52"/>
<polygon points="128,138 272,138 252,116 148,116"/>
<rect x="155" y="82" width="90" height="34"/>
<polygon points="145,82 255,82 236,62 164,62"/>
<rect x="170" y="34" width="60" height="28"/>
<polygon points="160,34 240,34 222,12 178,12"/>
</g>
<text x="200" y="222" text-anchor="middle" font-family="'Hiragino Sans','Noto Sans JP',sans-serif" font-size="20" font-weight="700" fill="${s}">${escapeXml(castle.name)}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
