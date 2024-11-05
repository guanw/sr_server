import { Enemy, EnemyObject } from "../entity/Enemy";
import Utils from "../Utils";

type EnemiesMap = { [key: string]: Enemy };
type EnemiesSerialization = { [key: string]: EnemyObject };

class EnemiesStateManager {
    private enemiesMap: EnemiesMap;

    public constructor() {
      this.reset();
    }

    public addEnemy() {
      const uuid = Utils.genUID();
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
      delete(this.enemiesMap[enemyKey]);
    }

    public destroyAllEnemies() {
      Object.keys(this.enemiesMap).forEach((key) => {
        this.killEnemy(key);
      });
    }

    public reset() {
      this.enemiesMap = {};
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;