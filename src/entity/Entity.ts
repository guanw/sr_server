
const AVATAR_SPEED = 3;
export abstract class Entity implements Serializable {
  serialize<T>(): T {
    throw new Error("Method not implemented.");
  }
  public abstract getX(): number;
  public abstract getY(): number;
  public abstract setDeltaX(x: number): void;
  public abstract setDeltaY(y: number): void;

  public moveLeft(offset = 1): void {
    this.setDeltaX(-AVATAR_SPEED * offset);
  }

  public moveRight(offset = 1): void {
    this.setDeltaX(AVATAR_SPEED * offset);
  }

  public moveDown(offset = 1): void {
    this.setDeltaY(AVATAR_SPEED * offset);
  }

  public moveUp(offset = 1): void {
    this.setDeltaY(-AVATAR_SPEED * offset);
  }

  isCollidedWith(ent: Entity, range = 10): boolean {
    const currentX = this.getX();
    const currentY = this.getY();

    const otherX = ent.getX();
    const otherY = ent.getY();
    const distance = Math.sqrt(
      (currentX - otherX) ** 2 + (currentY - otherY) ** 2
    );
    return distance <= range;
  }
}

export interface Serializable {
  serialize<T>():T;
}