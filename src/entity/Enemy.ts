import { GAME_WIDTH, GAME_HEIGHT, DISPLACEMENT, ENEMY_SPEED } from "../Constants";
import { Entity } from "./Entity";

export interface EnemyObject {
  x: number;
  y: number;
};

class Enemy extends Entity {
  private key: string;
  private x: number;
  private y: number;
  constructor(key: string) {
    super();
    // this.x = Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
    // this.y = Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
    this.key = key;
    this.x = 200;
    this.y = 200;
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

  public serialize(): EnemyObject {
    return {
      x: this.getX(),
      y: this.getY(),
    }
  }

  public moveTowardsAvatar(avatarX: number, avatarY: number) {
    const enemyX = this.getX();
    const enemyY = this.getY();
    const dx = avatarX - enemyX;
    const dy = avatarY - enemyY;
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * ENEMY_SPEED;
    const vy = Math.sin(angle) * ENEMY_SPEED;
    this.setPos(enemyX + vx, enemyY + vy);
    console.log(`current enemy ${this.key} loc: ${enemyX + vx}, ${enemyY + vy}`);
  }
}

export { Enemy };
