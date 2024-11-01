import { SAND_TILING_COUNT, PILLAR_TILING_COUNT, GAME_WINDOW_SIZE, TILING_SIZE, WORLD_SIZE_EXPANSION } from "../Constants";
import { Tiling, TilingObject } from "../entity/Tiling";
import Utils from "../Utils";

type TilingsMap = { [key: string]: Tiling };
type TilingsSerialization = { [key: string]: TilingObject };
enum TILING {
  SAND = "SAND",
  TOP_PILLAR = "TOP_PILLAR",
  MIDDLE_PILLAR = "MIDDLE_PILLAR",
  BOTTOM_PILLAR = "BOTTOM_PILLAR",
}

class TilingStateManager {
  private tilings: TilingsMap;
  public constructor() {
    this.tilings = {};
    const WORLD_SIZE = GAME_WINDOW_SIZE * WORLD_SIZE_EXPANSION;

    for (let i = 0; i < SAND_TILING_COUNT; i++) {
        const uuid = Utils.genUID();
        this.tilings[uuid] = new Tiling(TILING.SAND);
    }
    for (let i = 0; i < PILLAR_TILING_COUNT; i++) {
        const baseX = Math.random() * WORLD_SIZE;
        const baseY = Math.random() * WORLD_SIZE;
        let uuid = Utils.genUID();
        this.tilings[uuid] = new Tiling(TILING.BOTTOM_PILLAR, baseX, baseY);

        uuid = Utils.genUID();
        this.tilings[uuid] = new Tiling(TILING.MIDDLE_PILLAR, baseX, baseY + TILING_SIZE);

        uuid = Utils.genUID();
        this.tilings[uuid] = new Tiling(TILING.TOP_PILLAR, baseX, baseY + TILING_SIZE * 2);
    }
  }

  public getTilings(): TilingsMap {
    return this.tilings;
  }

  public serialize(): TilingsSerialization {
    const serialization: TilingsSerialization = {};
    Object.keys(this.tilings).forEach((key) => {
      const tiling = this.tilings[key];
        serialization[key] = {
          x: tiling.getX(),
          y: tiling.getY(),
          type: tiling.getType(),
      };
    })
    return serialization;
  }
}

const tilingStateManager = new TilingStateManager();
export default tilingStateManager;
