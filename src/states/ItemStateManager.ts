import { v4 as uuidv4 } from "uuid";
import { Bomb, Potion, Item, ItemObject } from "../entity/Items/Item";

type ItemsMap = { [key: string]: Item };
type ItemsSerialization = { [key: string]: ItemObject };

class ItemsStateManager {
  private itemsMap: ItemsMap;
  public constructor() {
    this.itemsMap = {};
  }

  public addItem() {
    const uuid = uuidv4();
    const n = this.getRandomInteger(2);
    switch (n) {
      case 1:
        this.itemsMap[uuid] = new Bomb();
        break;
      case 2:
        this.itemsMap[uuid] = new Potion();
        break;
      default:
    }
  }

  private getRandomInteger(n: number): number {
    return Math.floor(Math.random() * n) + 1;
  }

  public getItems(): ItemsMap {
    return this.itemsMap;
  }

  public serialize(): ItemsSerialization {
    const serialization: ItemsSerialization = {};
    for (const key in this.itemsMap) {
        const enemy = this.itemsMap[key];
        serialization[key] = {
          x: enemy.getX(),
          y: enemy.getY(),
      };
    }
    return serialization;
  }
}

export const itemsStateManager = new ItemsStateManager();
