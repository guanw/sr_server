import avatarStateManager from "../AvatarStateManager";

describe('add', () => {
  const roomNumber = "1";
  it('addAvatar should create new enemy', () => {
    avatarStateManager.addAvatar(roomNumber, "test");
    const avatarKeys = Object.keys(avatarStateManager.getAvatars(roomNumber));
    expect(avatarKeys.length).toBe(1);

  });

  it('addAvatar should create default action map', () => {
    avatarStateManager.addAvatar(roomNumber, "test");
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
    const serializedStates = avatarStateManager.serialize(roomNumber);
    const avatarKeys = Object.keys(serializedStates);
    expect(avatarKeys.length).toBe(1);
    const serializedAvatar = serializedStates[avatarKeys[0]];
    expect(serializedAvatar).toHaveProperty("x");
    expect(serializedAvatar).toHaveProperty("y");
    expect(serializedAvatar).toHaveProperty("hp");
  })

  it('removeAvatar should remove avatar', () => {
    const oldEnemyKeys = Object.keys(avatarStateManager.getAvatars(roomNumber));
    expect(oldEnemyKeys.length).toBe(1);
    avatarStateManager.removeAvatar(roomNumber, oldEnemyKeys[0]);
    expect(avatarStateManager.getAvatars(roomNumber)).toBeUndefined();
  })
});