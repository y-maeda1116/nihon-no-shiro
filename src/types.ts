/** 城の分類（平城・平山城・山城） */
export type CastleType = "平城" | "平山城" | "山城";

/** お城の情報（src/data/castles.json の1件に対応） */
export interface Castle {
  readonly id: string;
  readonly name: string;
  /** 読み仮名 */
  readonly kana: string;
  readonly prefecture: string;
  readonly type: CastleType;
  /** 築城年（現存建造物を基準とした年） */
  readonly builtYear: number;
  /** 築城年の表示用ラベル（和暦併記） */
  readonly builtYearLabel: string;
  /** 主な築城者・城主 */
  readonly lords: readonly string[];
  /** 現存天守を持つ城か（現存12天守） */
  readonly existingTenshu: boolean;
  /** 日本100名城に選定されているか */
  readonly hundredCastles: boolean;
  readonly tags: readonly string[];
  readonly summary: string;
  readonly features: readonly string[];
  readonly coordinates: {
    readonly lat: number;
    readonly lng: number;
  };
}
