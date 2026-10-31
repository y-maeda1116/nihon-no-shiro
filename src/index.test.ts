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

  it("収録城数は日本100名城の全100城", () => {
    expect(castles).toHaveLength(100);
  });

  it("47都道府県をすべて網羅する", () => {
    const prefectures = new Set(castles.map((c) => c.prefecture));
    expect(prefectures).toHaveLength(47);
  });

  it("全城が日本100名城に選定されている", () => {
    for (const castle of castles) {
      expect(castle.hundredCastles, castle.id).toBe(true);
    }
  });

  it("現存天守フラグは現存12天守と一致する", () => {
    const EXISTING_TENSHU = new Set([
      "hirosaki",
      "matsumoto",
      "maruoka",
      "inuyama",
      "hikone",
      "himeji",
      "matsue",
      "bicchu-matsuyama",
      "marugame",
      "matsuyama",
      "uwajima",
      "kochi",
    ]);
    const flagged = new Set(castles.filter((c) => c.existingTenshu).map((c) => c.id));
    expect(flagged).toEqual(EXISTING_TENSHU);
  });

  it("座標が重複する城がない（プロットの視認性のため概ね分離している）", () => {
    const coords = castles.map((c) => ({
      id: c.id,
      lat: c.coordinates.lat,
      lng: c.coordinates.lng,
    }));
    for (const [i, a] of coords.entries()) {
      for (const b of coords.slice(i + 1)) {
        const distance = Math.abs(a.lat - b.lat) + Math.abs(a.lng - b.lng);
        expect(distance, `${a.id} vs ${b.id}`).toBeGreaterThan(0.01);
      }
    }
  });
});
