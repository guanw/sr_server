import request from 'supertest';
import httpApp, { AVATAR_URL, BACKGROUND_TILE_URL, BASE_TILING_URL, BOMB_URL, ENEMY_URL, PILLAR_BOTTOM_TILING_URL, PILLAR_MIDDLE_TILING_URL, PILLAR_TOP_TILING_URL, POTION_URL, RANDOM_TILING_URL, WIND_URL } from '../httpApp';
import * as http from 'http';
import { GET_ROOT_NO_ROOM_NAME_ERROR } from '../Constants';

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(httpApp)
  server.listen(3000, () => done());
});

afterAll((done) => {
  server.close(done);
});


describe('GET /', () => {
  it('should ask for room name if not given', async () => {
    const response = await request(server).get('/');
    expect(response.text).toContain(GET_ROOT_NO_ROOM_NAME_ERROR)
  })

  // TODO enable testing on request with room name passed as query param

  // it('should return debugging info with serialized enemies, avatars, and items', async () => {
  //   const response = await request(server).get('/');
  //   expect(response.status).toBe(200);
  //   expect(response.text).toContain('<h1>debugging info</h1>');
  //   expect(response.text).toContain('enemies:');
  //   expect(response.text).toContain('avatar:');
  //   expect(response.text).toContain('items:');
  //   expect(response.text).toContain('tilings');
  // });
});

describe('GET /setup', () => {
  it('should return JSON with different asset urls', async () => {
    const response = await request(server).get('/setup');

    expect(response.status).toBe(200);
    const assets = response.body.assets;
    expect(assets).toHaveProperty('background_tile_url', BACKGROUND_TILE_URL);
    expect(assets).toHaveProperty('enemy_url', ENEMY_URL);
    expect(assets).toHaveProperty('avatar_url', AVATAR_URL);
    expect(assets).toHaveProperty('bomb_url', BOMB_URL);
    expect(assets).toHaveProperty('wind_url', WIND_URL);
    expect(assets).toHaveProperty('potion_url', POTION_URL);
    expect(assets).toHaveProperty('base_tiling_url', BASE_TILING_URL);
    expect(assets).toHaveProperty('random_tiling_url', RANDOM_TILING_URL);
    expect(assets).toHaveProperty('pillar_top_tiling_url', PILLAR_TOP_TILING_URL);
    expect(assets).toHaveProperty('pillar_middle_tiling_url', PILLAR_MIDDLE_TILING_URL);
    expect(assets).toHaveProperty('pillar_bottom_tiling_url', PILLAR_BOTTOM_TILING_URL);

    expect(response.body).toHaveProperty('tilings');
    expect(response.body['tilings']).toBeInstanceOf(Object);
  });
});
