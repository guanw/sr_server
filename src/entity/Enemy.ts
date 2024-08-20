import { Entity } from "./Entity";
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const DISPLACEMENT = 5;
const ENEMY_SPEED = 1;

export interface EnemyObject {
  x: number;
  y: number;
};

class Enemy extends Entity {
  private x: number;
  private y: number;
  constructor() {
    super();
    this.x = 400;//Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
    this.y = 300;//Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
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
    const dx = avatarX - DISPLACEMENT - enemyX;
    const dy = avatarY - DISPLACEMENT - enemyY;
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * ENEMY_SPEED;
    const vy = Math.sin(angle) * ENEMY_SPEED;
    this.setPos(enemyX + vx, enemyY + vy);
  }
}

export { Enemy };
