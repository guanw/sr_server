import { v4 as uuidv4 } from "uuid";
import { Item, ItemObject } from "../entity/Item";

type ItemsMap = { [key: string]: Item };
type ItemsSerialization = { [key: string]: ItemObject };

class ItemsStateManager {
  private items: ItemsMap;
  public constructor() {
    this.items = {};
  }

  public addItem() {
    const uuid = uuidv4();
    const n = this.getRandomInteger(2);
    switch (n) {
      case 1:
        this.items[uuid] = new Item('bomb');
        break;
      case 2:
        this.items[uuid] = new Item('potion');
        break;
      default:
    }
  }

  private getRandomInteger(n: number): number {
    return Math.floor(Math.random() * n) + 1;
  }

  public getItems(): ItemsMap {
    return this.items;
  }

  public serialize(): ItemsSerialization {
    const serialization: ItemsSerialization = {};
    Object.keys(this.items).forEach((key) => {
      const item = this.items[key];
        serialization[key] = {
          x: item.getX(),
          y: item.getY(),
          type: item.getType(),
      };
    })
    return serialization;
  }

  public consumeItem(itemKey: string) {
    delete(this.items[itemKey]);
  }

}

const itemsStateManager = new ItemsStateManager();
export default itemsStateManager;
