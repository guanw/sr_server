type EntitiesMap<T> = { [room: string]: { [entityId: string]: T } };

export class RoomStateManager<T> {
    private entitiesMap: EntitiesMap<T> = {};

    public addEntity(room: string, entityId: string, entity: T): void {
        if (!this.entitiesMap[room]) {
          this.entitiesMap[room] = {};
        }
        this.entitiesMap[room][entityId] = entity;
      }

      public getEntitiesByRoom(room: string): { [entityId: string]: T } {
        return this.entitiesMap[room] ?? {};
      }

      public getEntityByRoomAndId(room: string, entityId: string): T | undefined {
        return this.entitiesMap[room]?.[entityId];
      }

      public removeEntity(room: string, entityId: string): void {
        if (this.entitiesMap[room]) {
          delete this.entitiesMap[room][entityId];

          // Remove the room if empty
          if (Object.keys(this.entitiesMap[room]).length === 0) {
            delete this.entitiesMap[room];
          }
        }
      }

      public reset(): void {
        this.entitiesMap = {};
      }
}
