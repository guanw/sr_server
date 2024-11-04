import { HANDLE_GENERATE_NEW_ENEMY, HANDLE_TOGGLE_GAME_PLAY, UPDATE } from "../Events";
import { server, io, GameStateSnapShot } from "../socketIOServer";
import Client from "socket.io-client";
import gameStateManager from "../states/GameStateManager";

describe("Socket.IO Server", () => {
  let clientSocket;
  const PORT = 3000;

  beforeAll((done) => {
    server.listen(PORT, () => {
      console.log(`Test server listening on port ${PORT}`);
      done();
    });
  });

  afterAll((done) => {
    io.close();
    server.close();
    done();
  });

  beforeEach((done) => {
    clientSocket = Client(`http://localhost:${PORT}`);
    clientSocket.on("connect", done);
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  test("send HANDLE_TOGGLE_GAME_PLAY event", (done) => {
    // pause game
    const oldValue = gameStateManager.gameStopped();
    clientSocket.emit(HANDLE_TOGGLE_GAME_PLAY);
    clientSocket.on(UPDATE, (states: GameStateSnapShot) => {
        expect(states).not.toBeNull();
        expect(states).toHaveProperty('gameStopped', !oldValue);
        done();
    });
  });

  test("send HANDLE_GENERATE_NEW_ENEMY event", (done) => {
    clientSocket.emit(HANDLE_GENERATE_NEW_ENEMY);
    clientSocket.on(UPDATE, (states: GameStateSnapShot) => {
        expect(states).not.toBeNull();
        expect(states).toHaveProperty('enemies');
        const enemies = states['enemies'];
        const enemyKeys = Object.keys(enemies);
        expect(enemyKeys).toHaveLength(1);
        done();
    });
  })
});