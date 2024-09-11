import { Avatar, AvatarObject } from "../entity/Avatar";

type AvatarsMap = { [key: string]: Avatar };
type AvatarsActionMap = { [key: string]: AvatarAction };
type AvatarAction = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
}
type AvatarsSerialization = { [key: string]: AvatarObject };

class AvatarStateManager {
    private avatarsMap: AvatarsMap;
    private avatarsActionMap: AvatarsActionMap;

    public constructor() {
      this.avatarsMap = {};
      this.avatarsActionMap = {};
    }

    public addAvatar(id: string) {
      this.avatarsMap[id] = new Avatar();
      this.avatarsActionMap[id] = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
      };
    }

    public getAvatars(): AvatarsMap {
      return this.avatarsMap;
    }

    public getAvatarActionMap(): AvatarsActionMap {
      return this.avatarsActionMap;
    }

    public getFirstAvatar(): Avatar {
      const keys = Object.keys(this.avatarsMap);
      if (keys.length === 0) {
        return null;
      }

      return this.avatarsMap[keys[0]];
    }

    public serialize(): AvatarsSerialization {
      const serialization: AvatarsSerialization = {};
      Object.keys(this.avatarsMap).forEach((key) => {
        const avatar = this.avatarsMap[key];
          serialization[key] = {
            x: avatar.getX(),
            y: avatar.getY(),
            hp: avatar.getHp(),
        };
      })
      return serialization;
    }

    public removeAvatar(avatarKey: string) {
      delete(this.avatarsMap[avatarKey]);
    }
}

const avatarStateManager = new AvatarStateManager();
export default avatarStateManager;