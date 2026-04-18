import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'Password123!',
    fullName: 'Test Auditor',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Flow', () => {
    it('/auth/register (POST) - Happy Path', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user.username).toBe(testUser.username);
          expect(res.body.data.user.role).toBe('staff'); // Default role
          expect(res.body.data.user.password).toBeUndefined(); // Security check
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('/auth/register (POST) - Conflict (Duplicate Username)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/auth/login (POST) - Happy Path', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.data.accessToken).toBeDefined();
      authToken = response.body.data.accessToken;
    });

    it('/auth/login (POST) - Wrong Password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('User CRUD (Protected Routes)', () => {
    it('/users (GET) - Unauthorized Access (No Token)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('/users (GET) - Success with Token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          // Kiểm tra xem có trường nhạy cảm không
          if (res.body.data.length > 0) {
            expect(res.body.data[0].password).toBeUndefined();
          }
        });
    });

    it('/users/:id (PATCH) - Update FullName', async () => {
      // Lấy danh sách để có ID
      const listRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`);
      
      const userId = listRes.body.data.find(u => u.username === testUser.username).id;

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ fullName: 'Updated Name QA' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.fullName).toBe('Updated Name QA');
        });
    });
  });
});
