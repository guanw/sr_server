import { GAME_WINDOW_SIZE, AVATAR_DISPLACEMENT, ENEMY_SPEED } from "../Constants";
import { Entity } from "./Entity";

export type EnemyObject = {
  x: number;
  y: number;
};

class Enemy extends Entity {
  private x: number;
  private y: number;
  constructor() {
    super();
    this.x = Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
    this.y = Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
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

  public serialize<EnemyObject>(): EnemyObject {
    return {
      x: this.getX(),
      y: this.getY(),
    } as unknown as EnemyObject;
  }

  public moveTowardsAvatar(avatarX: number, avatarY: number) {
    const enemyX = this.getX();
    const enemyY = this.getY();
    const dx = avatarX - AVATAR_DISPLACEMENT - enemyX;
    const dy = avatarY - AVATAR_DISPLACEMENT - enemyY;
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * ENEMY_SPEED;
    const vy = Math.sin(angle) * ENEMY_SPEED;
    this.setPos(enemyX + vx, enemyY + vy);
  }
}

export { Enemy };
