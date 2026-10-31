/**
 * Wikimedia Commons から城の写真候補を取得し、
 * src/data/castle-photos.json（id -> ライセンス付き画像情報）を生成するスクリプト。
 *
 * - 各城の日本語 Wikipedia 記事に使われている画像（ほぼ Commons 保管）を対象にする
 * - ライセンスが CC BY / CC BY-SA / CC0 / パブリックドメインのものだけ採用
 * - 画像URLは upload.wikimedia.org のサムネイル（ホットリンク、出典は詳細画面に表示）
 *
 * 使い方: node scripts/fetch-castle-photos.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const API = "https://ja.wikipedia.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const THUMB_WIDTH = 640;
const UA = "nihon-no-shiro-photo-fetcher/1.0 (github.com/y-maeda1116/nihon-no-shiro)";

/** 記事名が城名と異なる城の候補（先頭のものを優先） */
const TITLE_OVERRIDES = {
  "ashikaga-yakata": ["鑁阿寺", "足利氏館"],
  "takeda-yakata": ["武田氏館", "武田神社"],
  kojinyama: ["郡山城 (安芸国)", "郡山城"],
  takamatsu: ["高松城 (讃岐国)", "玉藻城", "高松城"],
  matsuyama: ["松山城 (伊予国)", "松山城"],
  ono: ["大野城 (城跡)", "大野城 (筑紫野・太宰府)", "大野城"],
  funai: ["府内城", "大分府内城"],
  kagoshima: ["鹿児島城", "鶴丸城"],
  oka: ["岡城 (豊後国)", "岡城"],
  "bicchu-matsuyama": ["備中松山城", "松山城 (備中国)"],
  iwakuni: ["岩国城"],
  edo: ["江戸城"],
};

/** 画像ファイル名に含まれていたら除外する語（地図や紋章など写真以外） */
const FILE_NAME_EXCLUDE = /地図|位置図|略図|紋|旗|ロゴ|ロケータ|Map|map|locator|coat|flag|seal/;

const ALLOWED_LICENSE = /^(cc by-sa|cc by|cc0|public domain|pd|attribution)/i;
const DENIED_LICENSE = /non-free|fair use|\bnc\b|\bnd\b/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** レート制限（429）に配慮した逐次リクエスト */
async function api(base, params) {
  const url = new URL(base);
  url.search = new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let attempt = 0; attempt < 6; attempt++) {
    await sleep(300);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 429) {
      console.log(`  ...429, ${5 * (attempt + 1)}秒待機`);
      await sleep(5000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${url.pathname}${url.search}`);
    return res.json();
  }
  throw new Error(`429 persisted: ${url.pathname}${url.search}`);
}

/** Commons API が付与する utm_* トラッキングパラメータを除去する */
function cleanThumbUrl(url) {
  const parsed = new URL(url);
  parsed.search = "";
  return parsed.toString();
}

function stripHtml(text) {
  // 先に実体参照をデコードしてからタグを除去する（&lt;script&gt; の復元を防ぐ）
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "")
    .replace(/</g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** 記事の先頭の画像ファイル名リストを返す */
async function articleFiles(title) {
  const data = await api(API, {
    action: "query",
    titles: title,
    prop: "images",
    imlimit: "10",
    redirects: "1",
  });
  const page = data.query?.pages?.[0];
  if (!page || page.missing) return null;
  return (page.images ?? []).map((img) => img.title);
}

/** Commons のファイル情報（ライセンス・著作者・サムネイルURL）を一括取得 */
async function fileInfos(fileTitles) {
  const data = await api(COMMONS_API, {
    action: "query",
    titles: fileTitles.join("|"),
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: String(THUMB_WIDTH),
    redirects: "1",
  });
  const byTitle = new Map();
  for (const page of data.query?.pages ?? []) {
    const info = page?.imageinfo?.[0];
    if (!info) continue;
    const rawThumbUrl = info.thumburl ?? info.url;
    if (!rawThumbUrl) continue;
    const meta = info.extmetadata ?? {};
    byTitle.set(page.title, {
      mime: info.mime,
      thumbUrl: cleanThumbUrl(rawThumbUrl),
      sourceUrl: info.descriptionurl,
      license: stripHtml(meta.LicenseShortName?.value ?? ""),
      author: stripHtml(meta.Artist?.value ?? ""),
    });
  }
  return byTitle;
}

async function main() {
  const castles = JSON.parse(readFileSync(new URL("../src/data/castles.json", import.meta.url)));
  const photos = {};
  const missing = [];

  for (const castle of castles) {
    const candidates = TITLE_OVERRIDES[castle.id] ?? [castle.name];
    let adopted = null;
    let articleFound = false;

    for (const title of candidates) {
      const files = await articleFiles(title);
      if (files === null) continue;
      articleFound = true;

      // 候補ファイルの情報を1リクエストでまとめて取得
      // （ja側の「ファイル:」接頭辞は Commons では無効のため「File:」に変換）
      const candidates2 = files
        .filter((file) => !FILE_NAME_EXCLUDE.test(file))
        .slice(0, 10)
        .map((file) => file.replace(/^ファイル:/, "File:"));
      // 全候補が除外された場合は空の titles でリクエストしない
      if (candidates2.length === 0) continue;
      const infos = await fileInfos(candidates2);
      for (const file of candidates2) {
        const info = infos.get(file);
        if (!info) continue;
        if (!/^image\/(jpeg|png)$/.test(info.mime)) continue;
        if (!ALLOWED_LICENSE.test(info.license) || DENIED_LICENSE.test(info.license)) continue;
        if (!info.author) continue;
        adopted = {
          article: title,
          file: file.replace(/^File:/, ""),
          thumbUrl: info.thumbUrl,
          sourceUrl: info.sourceUrl,
          license: info.license,
          author: info.author,
        };
        break;
      }
      if (adopted) break;
    }

    if (adopted) {
      photos[castle.id] = adopted;
      console.log(`ok   ${castle.id}: ${adopted.license} / ${adopted.author.slice(0, 30)}`);
    } else {
      missing.push(castle.id);
      console.log(
        `skip ${castle.id}${articleFound ? " (適切なライセンスの写真なし)" : " (記事なし)"}`
      );
    }
  }

  const out = new URL("../src/data/castle-photos.json", import.meta.url);
  writeFileSync(out, `${JSON.stringify(photos, null, 2)}\n`);
  console.log(`\n${Object.keys(photos).length}/${castles.length} 城に写真を設定 → ${out.pathname}`);
  if (missing.length > 0) console.log(`写真なし: ${missing.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
