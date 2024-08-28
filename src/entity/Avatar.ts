import { Entity } from "./Entity";

export interface AvatarObject {
  x: number;
  y: number;
  hp: number;
};

export const ENEMY_ATTACK_VALUE = 10;
class Avatar extends Entity {
  private x: number;
  private y: number;
  private hp: number;
  constructor() {
    super();
    this.x = 400;
    this.y = 400;
    this.hp = 100;
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

  collide() {
    this.hp -= ENEMY_ATTACK_VALUE;
  }

  serialize(): AvatarObject {
    return {
      x: this.x,
      y: this.y,
      hp: this.hp,
    };
  }
}

export { Avatar };
