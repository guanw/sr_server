import { GAME_WINDOW_SIZE, WORLD_SIZE_EXPANSION } from "../Constants";
import { Entity } from "./Entity";

export interface TilingObject {
    x: number;
    y: number;
    type: string;
};

class Tiling extends Entity {
    private x: number;
    private y: number;
    private type: string;
    constructor(type: string, xOverride: number | undefined = undefined, yOverride: number | undefined = undefined) {
      super();
      const WORLD_SIZE = GAME_WINDOW_SIZE * WORLD_SIZE_EXPANSION;
      this.x = xOverride ?? Math.random() * WORLD_SIZE;
      this.y = yOverride ?? Math.random() * WORLD_SIZE;
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

    public serialize<TilingObject>(): TilingObject {
      return {
        x: this.getX(),
        y: this.getY(),
        type: this.type,
      } as unknown as TilingObject;
    }
}

export { Tiling };
