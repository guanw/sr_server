import { Enemy, EnemyObject } from "../entity/Enemy";
import { v4 as uuidv4 } from "uuid";

type EnemiesMap = { [key: string]: Enemy };
type EnemiesSerialization = { [key: string]: EnemyObject };

class EnemiesStateManager {
    private enemiesMap: EnemiesMap;

    public constructor() {
      this.enemiesMap = {};
    }

    public addEnemy() {
      const uuid = uuidv4();
      this.enemiesMap[uuid] = new Enemy();
    }

    public getEnemies(): EnemiesMap {
      return this.enemiesMap;
    }

    public serialize(): EnemiesSerialization {
      const serialization: EnemiesSerialization = {};
      Object.keys(this.enemiesMap).forEach((key) => {
        const enemy = this.enemiesMap[key];
          serialization[key] = {
            x: enemy.getX(),
            y: enemy.getY(),
        };
      })
      return serialization;
    }

    public killEnemy(enemyKey: string) {
      Object.keys(this.enemiesMap).forEach((key) => {
        delete(this.enemiesMap[enemyKey]);
      });
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;