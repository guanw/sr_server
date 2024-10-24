import request from 'supertest';
import httpApp, { AVATAR_URL, BACKGROUND_TILE_URL, BOMB_URL, ENEMY_URL, POTION_URL, WIND_URL } from '../httpApp';
import * as http from 'http';

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(httpApp)
  server.listen(3000, () => done());
});

afterAll((done) => {
  server.close(done);
});

describe('GET /', () => {
  it('should return debugging info with serialized enemies, avatars, and items', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>debugging info</h1>');
    expect(response.text).toContain('enemies:');
    expect(response.text).toContain('avatar:');
    expect(response.text).toContain('items:');
  });
});

describe('GET /setup', () => {
  it('should return JSON with different asset urls', async () => {
    const response = await request(server).get('/setup');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('background_tile_url', BACKGROUND_TILE_URL);
    expect(response.body).toHaveProperty('enemy_url', ENEMY_URL);
    expect(response.body).toHaveProperty('avatar_url', AVATAR_URL);
    expect(response.body).toHaveProperty('bomb_url', BOMB_URL);
    expect(response.body).toHaveProperty('wind_url', WIND_URL);
    expect(response.body).toHaveProperty('potion_url', POTION_URL);
  });
});
