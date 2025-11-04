import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

afterAll(async () => {
  // Clean up the database after all tests
  await pool.query("DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test@%')");
  await pool.query("DELETE FROM users WHERE email LIKE 'test@%'");
  await pool.end();
});

describe('Auth API', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        display_name: 'Test User'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not register an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        display_name: 'Test User'
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('mensaje', 'El usuario ya está registrado');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('mensaje', 'Contraseña incorrecta');
  });

  it('should not login a non-existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test2@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('mensaje', 'Usuario no encontrado');
  });
});
