import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Classes Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let classId: string;

  const testUser = {
    username: `admin_class_${Date.now()}`,
    password: 'Password123!',
    fullName: 'Admin Class Test',
  };

  const testClass = {
    className: `Lớp Test ${Date.now()}`,
    description: 'Mô tả lớp học test',
    monthlyFee: 500000,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    authToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/classes (POST) - Create Class', () => {
    return request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testClass)
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.className).toBe(testClass.className);
        classId = res.body.data.id;
      });
  });

  it('/classes (GET) - Get All Classes', () => {
    return request(app.getHttpServer())
      .get('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/classes/:id (PATCH) - Update Class', () => {
    return request(app.getHttpServer())
      .patch(`/classes/${classId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'Mô tả đã cập nhật' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.description).toBe('Mô tả đã cập nhật');
      });
  });

  it('/classes/:id (DELETE) - Delete Class', () => {
    return request(app.getHttpServer())
      .delete(`/classes/${classId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
