import { GAME_SIZE } from "../Constants";
import { Entity } from "./Entity";

export enum TILING {
  SAND = "SAND",
  PILLAR = "PILLAR",
}

export interface TilingObject {
    x: number;
    y: number;
    type: string;
};

class Tiling extends Entity {
    private x: number;
    private y: number;
    private type: string;
    constructor(type: string) {
      super();
      const WORLD_SIZE = GAME_SIZE * 15;
      this.x = Math.random() * WORLD_SIZE;
      this.y = Math.random() * WORLD_SIZE;
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

    public serialize(): TilingObject {
      return {
        x: this.getX(),
        y: this.getY(),
        type: this.type,
      }
    }
}

export { Tiling };
