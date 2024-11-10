import { Avatar, AvatarObject } from "../entity/Avatar";
import { RoomStateManager } from "./RoomStateManager";

type AvatarsMap = { [key: string]: Avatar };
type AvatarsActionMap = { [roomName: string]: { [key: string]: AvatarAction } };
type AvatarAction = {
  ArrowLeft: boolean,
  ArrowRight: boolean,
  ArrowUp: boolean,
  ArrowDown: boolean,
}
type AvatarsSerialization = { [roomName: string]: {[key: string]: AvatarObject } };

class AvatarStateManager extends RoomStateManager<Avatar>{
    private avatarsActionMap: AvatarsActionMap;

    public constructor() {
      super();
      this.reset();
    }

    public addAvatar(roomName: string, avatarId: string) {
      super.addEntity(roomName, avatarId, new Avatar());

      // Initialize actions map for the avatar
      if (!this.avatarsActionMap[roomName]) {
        this.avatarsActionMap[roomName] = {};
      }
      this.avatarsActionMap[roomName][avatarId] = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
      };
    }

    public getAllRooms(): string[] {
      return Object.keys(this.avatarsActionMap);
    }

    public getAvatars(roomName: string): AvatarsMap {
      return super.getEntitiesByRoom(roomName);
    }

    public getAvatarById(roomName: string, id: string): Avatar {
      return super.getEntityByRoomAndId(roomName, id);
    }

    public getAvatarActionMap(): AvatarsActionMap {
      return this.avatarsActionMap;
    }

    public getAvatarActionById(roomName: string, avatarId: string): AvatarAction {
      const roomAvatarsActionMap = this.avatarsActionMap[roomName];
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

    public getFirstAvatar(roomName: string): Avatar {
      const avatarsMap = super.getEntitiesByRoom(roomName);
      const keys = Object.keys(avatarsMap);
      if (keys.length === 0) {
        return null;
      }

      return avatarsMap[keys[0]];
    }

    public serialize(roomNumber): AvatarsSerialization {
      const serialization: AvatarsSerialization = {};
      const entitiesByRoom = super.getEntitiesByRoom(roomNumber);
      Object.keys(entitiesByRoom).forEach((key) => {
        const avatar = entitiesByRoom[key];
        serialization[key] = avatar.serialize();
      })
      return serialization;
    }

    public removeAvatar(roomName:string, avatarKey: string) {
      super.removeEntity(roomName, avatarKey);
      this.remnoveAvatarAction(roomName, avatarKey);
    }
    private remnoveAvatarAction(roomName: string, avatarKey: string) {
      if (this.avatarsActionMap[roomName]) {
        delete this.avatarsActionMap[roomName][avatarKey];
        if (Object.keys(this.avatarsActionMap[roomName]).length === 0) {
          delete this.avatarsActionMap[roomName];
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