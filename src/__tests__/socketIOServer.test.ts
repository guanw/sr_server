import { HANDLE_TOGGLE_GAME_PLAY, UPDATE } from "../Events";
import { server, io, GameStateSnapShot } from "../socketIOServer";
import Client from "socket.io-client";

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

  test("should receive 'messageReceived' event with correct data", (done) => {
    // pause game
    clientSocket.emit(HANDLE_TOGGLE_GAME_PLAY);
    clientSocket.on(UPDATE, (states) => {
        const parsedStates = states as GameStateSnapShot;
        expect(parsedStates).not.toBeNull();
        expect(parsedStates).toHaveProperty('gameStopped', true);
        done();
    });

    // resume game
    clientSocket.emit(HANDLE_TOGGLE_GAME_PLAY);
    clientSocket.on(UPDATE, (states) => {
        const parsedStates = states as GameStateSnapShot;
        expect(parsedStates).not.toBeNull();
        expect(parsedStates).toHaveProperty('gameStopped', false);
        done();
    });
    done();
  });

});