import gameStateManager from "../GameStateManager";

describe('gameStateManager tests', () => {
  it('toggle game state', () => {
    gameStateManager.toggle();
    expect(gameStateManager.gameStopped()).toBe(true);
  });
});