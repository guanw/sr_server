import { GAME_WINDOW_SIZE, ENEMY_ATTACK_VALUE } from "../Constants";
import { Entity } from "./Entity";

export type AvatarObject = {
  x: number;
  y: number;
  hp: number;
};

class Avatar extends Entity {
  private x: number;
  private y: number;
  private hp: number;
  constructor() {
    super();
    this.x = Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
    this.y = Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
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

  public setPos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  collide() {
    this.hp -= Math.ceil(Math.random() * ENEMY_ATTACK_VALUE);
  }

  serialize<AvatarObject>(): AvatarObject {
    return {
      x: this.x,
      y: this.y,
      hp: this.hp,
    } as unknown as AvatarObject;
  }

  getHp(): number {
    return this.hp;
  }
}

export { Avatar };
