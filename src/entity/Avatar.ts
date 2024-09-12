import { GAME_WIDTH, GAME_HEIGHT, ENEMY_ATTACK_VALUE } from "../Constants";
import { Entity } from "./Entity";

export interface AvatarObject {
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
    this.x = Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
    this.y = Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
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
