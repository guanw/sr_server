import { v4 as uuidv4 } from "uuid";
import { SAND_TILING_COUNT, PILLAR_TILING_COUNT, GAME_SIZE, TILING_SIZE } from "../Constants";
import { Tiling, TilingObject } from "../entity/Tiling";

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
    const WORLD_SIZE = GAME_SIZE * 15;

    for (let i = 0; i < SAND_TILING_COUNT; i++) {
        const uuid = uuidv4();
        this.tilings[uuid] = new Tiling(TILING.SAND);
    }
    for (let i = 0; i < PILLAR_TILING_COUNT; i++) {
        const baseX = Math.random() * WORLD_SIZE;
        const baseY = Math.random() * WORLD_SIZE;
        let uuid = uuidv4();
        this.tilings[uuid] = new Tiling(TILING.BOTTOM_PILLAR, baseX, baseY);

        uuid = uuidv4();
        this.tilings[uuid] = new Tiling(TILING.MIDDLE_PILLAR, baseX, baseY + TILING_SIZE);

        uuid = uuidv4();
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
