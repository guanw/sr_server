import avatarStateManager from "../AvatarStateManager";

describe('add', () => {
  const room = "1";
  it('addAvatar should create new enemy', () => {
    avatarStateManager.addAvatar(room, "test");
    const avatarKeys = Object.keys(avatarStateManager.getAvatars(room));
    expect(avatarKeys.length).toBe(1);

  });

  it('addAvatar should create default action map', () => {
    avatarStateManager.addAvatar(room, "test");
    const actionMap = avatarStateManager.getAvatarActionMap();
    const avatarActionMapKeys = Object.keys(actionMap);
    expect(avatarActionMapKeys.length).toBe(1);

    const key = avatarActionMapKeys[0];
    expect(actionMap[key]).toMatchObject({"test":{
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    }});
  });

  it('serialize should return x,y,hp of avatar', () => {
    const serializedStates = avatarStateManager.serialize(room);
    const avatarKeys = Object.keys(serializedStates);
    expect(avatarKeys.length).toBe(1);
    const serializedAvatar = serializedStates[avatarKeys[0]];
    expect(serializedAvatar).toHaveProperty("x");
    expect(serializedAvatar).toHaveProperty("y");
    expect(serializedAvatar).toHaveProperty("hp");
  })

  it('removeAvatar should remove avatar', () => {
    const oldEnemyKeys = Object.keys(avatarStateManager.getAvatars(room));
    expect(oldEnemyKeys.length).toBe(1);
    avatarStateManager.removeAvatar(room, oldEnemyKeys[0]);
    expect(avatarStateManager.getAvatars(room)).toMatchObject({});
  })
});