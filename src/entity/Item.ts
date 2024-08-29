import { GAME_HEIGHT, GAME_WIDTH } from "../Constants";
import { Entity } from "./Entity";

export interface ItemObject {
    x: number;
    y: number;
    type: string;
  };

class Item extends Entity {
    private x: number;
    private y: number;
    private type: string;
    constructor(type: string) {
      super();
      this.x = Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
      this.y = Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
      this.type = type;
    }

    getX(): number {
      return this.x;
    }
    getY(): number {
      return this.y;
    }
    setDeltaX(deltaX: number): void {
      this.x += deltaX;
    }
    setDeltaY(deltaY: number): void {
      this.y += deltaY;
    }
    getType(): string {
      return this.type;
  }

    public setPos(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    public serialize(): ItemObject {
      return {
        x: this.getX(),
        y: this.getY(),
        type: this.type,
      }
    }
}

export { Item };
