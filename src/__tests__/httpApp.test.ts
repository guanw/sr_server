import request from 'supertest';
import httpApp, { BACKGROUND_TILE_URL } from '../httpApp';
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
  it('should return JSON with background_tile_url', async () => {
    const response = await request(server).get('/setup');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('background_tile_url', BACKGROUND_TILE_URL);
  });
});
