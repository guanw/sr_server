import enemiesStateManager from "../EnemyStateManager";

describe('add', () => {
  const room = "1";
  it('addEnemy should create new enemy', () => {
    enemiesStateManager.addEnemy(room);
    const enemyKeys = Object.keys(enemiesStateManager.getEnemies(room));
    expect(enemyKeys.length).toBe(1);
  });

  it('serialize should return x,y of enemy', () => {
    const serializedStates = enemiesStateManager.serialize(room);
    const enemyKeys = Object.keys(serializedStates);
    expect(enemyKeys.length).toBe(1);
    const serializedEnemy = serializedStates[enemyKeys[0]];
    expect(serializedEnemy).toHaveProperty("x");
    expect(serializedEnemy).toHaveProperty("y");
  })

  it('killEnemy should remove enemy', () => {
    const oldEnemyKeys = Object.keys(enemiesStateManager.getEnemies(room));
    expect(oldEnemyKeys.length).toBe(1);
    enemiesStateManager.killEnemy(room, oldEnemyKeys[0]);
    const UpdatedenemyKeys = Object.keys(enemiesStateManager.getEnemies(room));
    expect(UpdatedenemyKeys.length).toBe(0);
  })
});