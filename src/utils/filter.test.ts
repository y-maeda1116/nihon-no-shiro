import { describe, expect, it } from "vitest";
import castlesData from "../data/castles.json";
import type { Castle } from "../types";
import { extractPrefectures, filterCastles, INITIAL_FILTER_STATE } from "./filter";

const castles = castlesData as readonly Castle[];

describe("filterCastles", () => {
  it("条件なしではすべての城を返す", () => {
    expect(filterCastles(castles, INITIAL_FILTER_STATE)).toHaveLength(castles.length);
  });

  it("キーワードが城名に部分一致する城を返す", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, keyword: "姫路" });
    expect(result.map((c) => c.id)).toEqual(["himeji"]);
  });

  it("キーワードが読み仮名に部分一致する城を返す（大小文字を区別しない）", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, keyword: "マツ" });
    expect(result.map((c) => c.name)).toEqual(
      expect.arrayContaining(["松本城", "松江城", "松山城", "備中松山城"])
    );
  });

  it("キーワードが城主に部分一致する城を返す", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, keyword: "加藤" });
    expect(result.map((c) => c.id)).toEqual(["kumamoto", "matsuyama"]);
  });

  it("キーワードがタグに部分一致する城を返す", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, keyword: "世界遺産" });
    expect(result.map((c) => c.id)).toEqual(expect.arrayContaining(["himeji", "nijo", "shuri"]));
  });

  it("都道府県で絞り込む", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, prefecture: "愛媛県" });
    expect(result.map((c) => c.id)).toEqual(["matsuyama", "uwajima"]);
  });

  it("城の分類で絞り込む", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, type: "山城" });
    expect(result.every((c) => c.type === "山城")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("キーワード・都道府県・分類を組み合わせて絞り込む", () => {
    const result = filterCastles(castles, {
      keyword: "現存天守",
      prefecture: "愛媛県",
      type: "山城",
    });
    expect(result.map((c) => c.id)).toEqual(["matsuyama"]);
  });

  it("一致する城がなければ空配列を返す", () => {
    const result = filterCastles(castles, { ...INITIAL_FILTER_STATE, keyword: "存在しない城" });
    expect(result).toEqual([]);
  });
});

describe("extractPrefectures", () => {
  it("都道府県を重複なく五十音順で返す", () => {
    const prefectures = extractPrefectures(castles);
    expect(prefectures).toEqual([...new Set(prefectures)]);
    expect(prefectures).toEqual([...prefectures].sort((a, b) => a.localeCompare(b, "ja")));
    expect(prefectures.length).toBeGreaterThan(0);
  });
});
