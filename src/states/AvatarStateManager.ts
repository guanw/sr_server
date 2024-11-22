import { Avatar, AvatarObject } from "../entity/Avatar";
import { RoomStateManager } from "./RoomStateManager";

type AvatarsMap = { [key: string]: Avatar };
type AvatarsActionMap = { [room: string]: { [key: string]: AvatarAction } };
type AvatarAction = {
  ArrowLeft: boolean,
  ArrowRight: boolean,
  ArrowUp: boolean,
  ArrowDown: boolean,
}
type AvatarsSerialization = { [room: string]: {[key: string]: AvatarObject } };

class AvatarStateManager extends RoomStateManager<Avatar>{
    private avatarsActionMap: AvatarsActionMap;

    public constructor() {
      super();
      this.reset();
    }

    public addAvatar(room: string, avatarId: string) {
      super.addEntity(room, avatarId, new Avatar());

      // Initialize actions map for the avatar
      if (!this.avatarsActionMap[room]) {
        this.avatarsActionMap[room] = {};
      }
      this.avatarsActionMap[room][avatarId] = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
      };
    }

    public getAllRooms(): string[] {
      return Object.keys(this.avatarsActionMap);
    }

    public getAvatars(room: string): AvatarsMap {
      return super.getEntitiesByRoom(room);
    }

    public getAvatarById(room: string, id: string): Avatar {
      return super.getEntityByRoomAndId(room, id);
    }

    public getAvatarActionMap(): AvatarsActionMap {
      return this.avatarsActionMap;
    }

    public getAvatarActionById(room: string, avatarId: string): AvatarAction {
      const roomAvatarsActionMap = this.avatarsActionMap[room];
      if (!roomAvatarsActionMap) {
        return {
          ArrowLeft: false,
          ArrowRight: false,
          ArrowUp: false,
          ArrowDown: false,
        };
      }
      return roomAvatarsActionMap[avatarId];
    }

    public getFirstAvatar(room: string): Avatar {
      const avatarsMap = super.getEntitiesByRoom(room);
      const keys = Object.keys(avatarsMap);
      if (keys.length === 0) {
        return null;
      }

      return avatarsMap[keys[0]];
    }

    public serialize(room): AvatarsSerialization {
      const serialization: AvatarsSerialization = {};
      const entitiesByRoom = super.getEntitiesByRoom(room);
      Object.keys(entitiesByRoom).forEach((key) => {
        const avatar = entitiesByRoom[key];
        serialization[key] = avatar.serialize();
      })
      return serialization;
    }

    public removeAvatar(room:string, avatarKey: string) {
      super.removeEntity(room, avatarKey);
      this.remnoveAvatarAction(room, avatarKey);
    }
    private remnoveAvatarAction(room: string, avatarKey: string) {
      if (this.avatarsActionMap[room]) {
        delete this.avatarsActionMap[room][avatarKey];
        if (Object.keys(this.avatarsActionMap[room]).length === 0) {
          delete this.avatarsActionMap[room];
        }
      }
    }

    public reset() {
      super.reset();
      this.avatarsActionMap = {};
    }
}

const avatarStateManager = new AvatarStateManager();
export default avatarStateManager;