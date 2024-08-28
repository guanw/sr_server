
import { GAME_HEIGHT, GAME_WIDTH } from "../../Constants";
import { Entity } from "../Entity";

export interface ItemObject {
    x: number;
    y: number;
};

abstract class Item extends Entity {
    protected x: number;
    protected y: number;
    abstract type: string;
    constructor() {
      super();
      this.x = Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
      this.y = Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
    }

    public getX(): number {
        return this.x;
    }
    public getY(): number {
        return this.y;
    }
    public setDeltaX(deltaX: number): void {
    }
    public setDeltaY(deltaY: number): void {
    }

    public serialize(): ItemObject {
        return {
          x: this.getX(),
          y: this.getY(),
        }
    }
}

class Bomb extends Item {
    type = "bomb";
}
class Potion extends Item {
    type = "potion";
}

export {Item, Bomb, Potion};