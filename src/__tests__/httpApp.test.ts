import request from 'supertest';
import httpApp, { AVATAR_URL, BACKGROUND_TILE_URL, BASE_TILING_URL, BOMB_URL, ENEMY_URL, PILLAR_BOTTOM_TILING_URL, PILLAR_MIDDLE_TILING_URL, PILLAR_TOP_TILING_URL, POTION_URL, RANDOM_TILING_URL, WIND_URL } from '../httpApp';
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
    expect(response.body).toHaveProperty('base_tiling_url', BASE_TILING_URL);
    expect(response.body).toHaveProperty('random_tiling_url', RANDOM_TILING_URL);
    expect(response.body).toHaveProperty('pillar_top_tiling_url', PILLAR_TOP_TILING_URL);
    expect(response.body).toHaveProperty('pillar_middle_tiling_url', PILLAR_MIDDLE_TILING_URL);
    expect(response.body).toHaveProperty('pillar_bottom_tiling_url', PILLAR_BOTTOM_TILING_URL);
  });
});
