import { describe, expect, it } from "vitest";
import castlesData from "./castles.json";
import photoData from "./castle-photos.json";
import type { CastlePhoto } from "./castlePhotos";

const castleIds = new Set((castlesData as { id: string }[]).map((c) => c.id));
const photos = photoData as Readonly<Record<string, CastlePhoto>>;
const entries = Object.entries(photos);

// 採用ライセンスの許可リスト（fetch-castle-photos.mjs と同じ基準）
const ALLOWED_LICENSE = /^(cc by-sa|cc by|cc0|public domain|pd|attribution)/i;
const DENIED_LICENSE = /non-free|fair use|\bnc\b|\bnd\b/i;
const WIKIMEDIA_THUMB_HOSTS = /^(upload|thumb)\.wikimedia\.org$/;

describe("castle-photos.json", () => {
  it("すべてのキーが実在する城IDである", () => {
    for (const [id] of entries) {
      expect(castleIds.has(id), `未知の城ID: ${id}`).toBe(true);
    }
  });

  it("すべてのエントリに著作者・ライセンス・出典URLがある", () => {
    for (const [id, photo] of entries) {
      expect(photo.author.trim(), `${id}: 著作者が空`).not.toBe("");
      expect(photo.license.trim(), `${id}: ライセンスが空`).not.toBe("");
      expect(photo.sourceUrl, `${id}: 出典URLが空`).not.toBe("");
    }
  });

  it("すべてのライセンスが許可リストに一致し、拒否条件を含まない", () => {
    for (const [id, photo] of entries) {
      expect(ALLOWED_LICENSE.test(photo.license), `${id}: 未許可ライセンス ${photo.license}`).toBe(
        true
      );
      expect(DENIED_LICENSE.test(photo.license), `${id}: 拒否ライセンス ${photo.license}`).toBe(
        false
      );
    }
  });

  it("thumbUrl が Wikimedia 公式ホストの HTTPS URL である", () => {
    for (const [id, photo] of entries) {
      const url = new URL(photo.thumbUrl);
      expect(url.protocol, `${id}: HTTPS でない`).toBe("https:");
      expect(
        WIKIMEDIA_THUMB_HOSTS.test(url.host),
        `${id}: Wikimedia 以外のホスト ${url.host}`
      ).toBe(true);
      expect(url.search, `${id}: クエリパラメータが残存`).toBe("");
    }
  });

  it("sourceUrl が Commons のファイル説明ページである", () => {
    for (const [id, photo] of entries) {
      const url = new URL(photo.sourceUrl);
      expect(url.host).toBe("commons.wikimedia.org");
      expect(url.pathname.startsWith("/wiki/File:"), `${id}: File: ページでない`).toBe(true);
    }
  });

  it("写真のない城は3城（フォールバック対象）である", () => {
    const withPhoto = new Set(entries.map(([id]) => id));
    const without = [...castleIds].filter((id) => !withPhoto.has(id)).sort();
    expect(without).toEqual(["fukuyama", "kojinyama", "ono"]);
  });
});
