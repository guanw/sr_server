import { HANDLE_GENERATE_NEW_ENEMY, HANDLE_GENERATE_NEW_ITEM, HANDLE_USER_KEY_DOWN, HANDLE_USER_KEY_UP, UPDATE } from "../Events";
import { server, io, GameStateSnapShot } from "../socketIOServer";
import Client from "socket.io-client";
import avatarStateManager from "../states/AvatarStateManager";
import itemsStateManager from "../states/ItemStateManager";
import enemiesStateManager from "../states/EnemyStateManager";

describe("Socket.IO Server", () => {
  let clientSocket;
  const PORT = 3000;

  beforeAll((done) => {
    server.listen(PORT, () => {
      console.log(`Test server listening on port ${PORT}`);
      done();
    });

    avatarStateManager.reset();
    itemsStateManager.reset();
    enemiesStateManager.reset();
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
  });

  test("send HANDLE_GENERATE_NEW_ITEM event", (done) => {
    clientSocket.emit(HANDLE_GENERATE_NEW_ITEM);
    clientSocket.on(UPDATE, (states: GameStateSnapShot) => {
        expect(states).not.toBeNull();
        expect(states).toHaveProperty('items');
        const items = states['items'];
        const itemKeys = Object.keys(items);
        expect(itemKeys).toHaveLength(1);
        done();
    });
  });

  test("send HANDLE_USER_KEY_DOWN event", (done) => {
    const TEST_KEY = 'ArrowLeft';
    clientSocket.emit(HANDLE_USER_KEY_DOWN, {key: TEST_KEY, avatarId: clientSocket.id}, () => {
        const avatarKeys = avatarStateManager.getAvatarActionById(clientSocket.id);
        expect(avatarKeys[TEST_KEY]).toBe(true);
        done();
    });
  });

  test("send HANDLE_USER_KEY_UP event", (done) => {
    const TEST_KEY = 'ArrowLeft';
    const avatarKeys = avatarStateManager.getAvatarActionById(clientSocket.id);
    avatarKeys.ArrowLeft = true;

    clientSocket.emit(HANDLE_USER_KEY_UP, {key: TEST_KEY, avatarId: clientSocket.id}, () => {
        const avatarKeys = avatarStateManager.getAvatarActionById(clientSocket.id);
        expect(avatarKeys[TEST_KEY]).toBe(false);
        done();
    });
  });
});