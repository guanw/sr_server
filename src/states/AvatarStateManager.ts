import { Avatar, AvatarObject } from "../entity/Avatar";

type AvatarsMap = { [key: string]: Avatar };
type AvatarsSerialization = { [key: string]: AvatarObject };

class AvatarStateManager {
    private avatarsMap: AvatarsMap;

    public constructor() {
      this.avatarsMap = {};
    }

    public addAvatar(id: string) {
      this.avatarsMap[id] = new Avatar();
    }

    public getAvatars(): AvatarsMap {
      return this.avatarsMap;
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