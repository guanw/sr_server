import { Enemy, EnemyObject } from "../entity/Enemy";
import Utils from "../Utils";
import { RoomStateManager } from "./RoomStateManager";

type EnemiesMap = { [key: string]: Enemy };
type EnemiesSerialization = { [key: string]: EnemyObject };

class EnemiesStateManager extends RoomStateManager<Enemy>{
    // private enemiesMap: EnemiesMap;

    public constructor() {
      super()
      this.reset();
    }

    public addEnemy(room: string) {
      const uuid = Utils.genUID();
      super.addEntity(room, uuid, new Enemy());
    }

    public getEnemies(room: string): EnemiesMap {
      return super.getEntitiesByRoom(room);
    }

    public serialize(room): EnemiesSerialization {
      const serialization: EnemiesSerialization = {};
      const entitiesByRoom = super.getEntitiesByRoom(room);
      Object.keys(entitiesByRoom).forEach((key) => {
        const avatar = entitiesByRoom[key];
        serialization[key] = avatar.serialize();
      })
      return serialization;
    }

    public killEnemy(room: string, enemyKey: string) {
      super.removeEntity(room, enemyKey)
    }

    public destroyAllEnemies() {
      super.reset();
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;