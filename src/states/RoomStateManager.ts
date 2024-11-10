type EntitiesMap<T> = { [roomName: string]: { [entityId: string]: T } };

export class RoomStateManager<T> {
    private entitiesMap: EntitiesMap<T> = {};

    public addEntity(roomName: string, entityId: string, entity: T): void {
        if (!this.entitiesMap[roomName]) {
          this.entitiesMap[roomName] = {};
        }
        this.entitiesMap[roomName][entityId] = entity;
      }

      public getEntitiesByRoom(roomName: string): { [entityId: string]: T } | undefined {
        return this.entitiesMap[roomName];
      }

      public getEntityByRoomAndId(roomName: string, entityId: string): T | undefined {
        return this.entitiesMap[roomName]?.[entityId];
      }

      public removeEntity(roomName: string, entityId: string): void {
        if (this.entitiesMap[roomName]) {
          delete this.entitiesMap[roomName][entityId];

          // Remove the room if empty
          if (Object.keys(this.entitiesMap[roomName]).length === 0) {
            delete this.entitiesMap[roomName];
          }
        }
      }

    //   public serialize<T>(): EntitiesSerialization<T> {
    //     const serialization: EntitiesSerialization<T> = {};
    //     Object.keys(this.entitiesMap).forEach((roomKey) => {
    //         serialization[roomKey] = {};
    //         const entities = this.entitiesMap[roomKey];
    //         //  = entities.serialize();
    //     })
    //     return serialization;
    //     }

      public reset(): void {
        this.entitiesMap = {};
      }
}
