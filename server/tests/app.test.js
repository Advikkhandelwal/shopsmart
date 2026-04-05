const request = require('supertest');
const app = require('../src/app');

describe('App Endpoints', () => {
  it('should return 200 on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'ShopSmart Backend is running');
  });

  it('should return 200 on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('ShopSmart Backend Service');
  });

  it('should return 404 on unknown routes', async () => {
    const res = await request(app).get('/some-unknown-route123');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });
  
  it('should have basic security headers (Helmet)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers['x-powered-by']).toBeUndefined(); 
  });

  it('should allow CORS from allowed origins', async () => {
    const res = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toEqual('http://localhost:5173');
  });
});
