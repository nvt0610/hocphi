import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('TuitionRecords Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let studentId: string;
  let recordId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    const testUser = {
      username: `admin_tuition_${Date.now()}`,
      password: 'Password123!',
      fullName: 'Admin Tuition Test',
    };
    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    authToken = loginRes.body.data.accessToken;

    const studentRes = await request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        fullName: 'Tuition Test Student',
      });
    studentId = studentRes.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tuition-records (POST) - Create Tuition Record', () => {
    return request(app.getHttpServer())
      .post('/tuition-records')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        studentId,
        amount: 5000000,
        billingMonth: '2024-01',
        content: 'Học phí test',
        status: 'Unpaid'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        recordId = res.body.data.id;
        expect(Number(res.body.data.amount)).toBe(5000000);
      });
  });

  it('/tuition-records (GET) - Get All Records', () => {
    return request(app.getHttpServer())
      .get('/tuition-records')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/tuition-records/:id/status (PATCH) - Update Payment Status', () => {
    return request(app.getHttpServer())
      .patch(`/tuition-records/${recordId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'Paid' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toBe('Paid');
      });
  });

  it('/tuition-records/:id (DELETE) - Remove Tuition Record', () => {
    return request(app.getHttpServer())
      .delete(`/tuition-records/${recordId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
