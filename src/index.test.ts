import { describe, expect, it } from "vitest";
import castlesData from "./data/castles.json";
import { CASTLE_TYPES } from "./config";
import type { Castle } from "./types";

const castles = castlesData as readonly Castle[];

describe("castles.json のデータ整合性", () => {
  it("id が重複しない", () => {
    const ids = castles.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("必須フィールドが空でない", () => {
    for (const castle of castles) {
      expect(castle.id, castle.id).toBeTruthy();
      expect(castle.name, castle.id).toBeTruthy();
      expect(castle.kana, castle.id).toBeTruthy();
      expect(castle.prefecture, castle.id).toBeTruthy();
      expect(castle.summary.length, castle.id).toBeGreaterThan(0);
      expect(castle.features.length, castle.id).toBeGreaterThan(0);
      expect(castle.tags.length, castle.id).toBeGreaterThan(0);
      expect(castle.lords.length, castle.id).toBeGreaterThan(0);
      expect(castle.builtYearLabel, castle.id).toBeTruthy();
    }
  });

  it("type は定義された分類のいずれか", () => {
    for (const castle of castles) {
      expect(CASTLE_TYPES, castle.id).toContain(castle.type);
    }
  });

  it("座標が日本の範囲内（緯度20〜46・経度122〜154）", () => {
    for (const castle of castles) {
      const { lat, lng } = castle.coordinates;
      expect(lat, castle.id).toBeGreaterThanOrEqual(20);
      expect(lat, castle.id).toBeLessThanOrEqual(46);
      expect(lng, castle.id).toBeGreaterThanOrEqual(122);
      expect(lng, castle.id).toBeLessThanOrEqual(154);
    }
  });
});
