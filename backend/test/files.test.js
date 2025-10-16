// test/files.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import fs from 'fs';
import path from 'path';

let token;
let uploadedFileId;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI);
  await mongoose.connection.db.dropDatabase();

  const signupRes = await request(app).post('/api/v1/auth/sign-up').send({
    firstName: 'Ishu',
    lastName: 'Dev',
    email: 'ishu@example.com',
    password: 'securePass123',
    role: 'user',
  }, 30000);

  expect(signupRes.statusCode).toBe(201);
  expect(signupRes.body.data.user.email).toBe('ishu@example.com');

  await wait(200); // Ensure DB consistency

  const signinRes = await request(app).post('/api/v1/auth/sign-in').send({
    email: 'ishu@example.com',
    password: 'securePass123',
  });

  expect(signinRes.statusCode).toBe(200);
  expect(signinRes.body.data).toHaveProperty('token');
  token = signinRes.body.data.token;

  const filePath = path.join(__dirname, 'mock.txt');
  fs.writeFileSync(filePath, 'Hello Ishu!');

  const uploadRes = await request(app)
    .post('/api/v1/files/upload')
    .set('Authorization', `Bearer ${token}`)
    .attach('file', filePath);

  fs.unlinkSync(filePath);

  expect(uploadRes.statusCode).toBe(201);
  uploadedFileId = uploadRes.body.file._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('File API Endpoints', () => {
  it('should load files for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/files')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.files)).toBe(true);
  });

  it('should upload a file', async () => {
    const filePath = path.join(__dirname, 'upload.txt');
    fs.writeFileSync(filePath, 'Upload test');

    const res = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', filePath);

    fs.unlinkSync(filePath);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'File uploaded');
    expect(res.body).toHaveProperty('file');
    expect(res.body.file).toHaveProperty('_id');
  });

  it('should generate a shareable URL', async () => {
    const res = await request(app)
      .get(`/api/v1/files/${uploadedFileId}/share`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body.url).toMatch(/^https?:\/\/.+/);
  });

  it('should generate a download URL', async () => {
    const res = await request(app)
      .get(`/api/v1/files/${uploadedFileId}/download`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body.url).toMatch(/^https?:\/\/.+/);
  });

  it('should block unauthenticated access', async () => {
    const res = await request(app).get('/api/v1/files');
    expect(res.statusCode).toBe(401);
  });
});
