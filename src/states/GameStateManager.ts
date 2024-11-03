class GameStateManager {
    private isGameStopped = false;
    public toggle() {
        this.isGameStopped = !this.isGameStopped;
    }
    public gameStopped() {
        return this.isGameStopped;
    }
}

const gameStateManager = new GameStateManager();
export default gameStateManager;