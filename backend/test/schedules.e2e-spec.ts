import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Schedules Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let classId: string;
  let scheduleId: string;

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
      username: `admin_sch_${Date.now()}`,
      password: 'Password123!',
      fullName: 'Admin Schedule Test',
    };
    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    authToken = loginRes.body.data.accessToken;

    const classRes = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ className: `Schedule_Class_${Date.now()}` });
    classId = classRes.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/schedules (POST) - Create Schedule', () => {
    return request(app.getHttpServer())
      .post('/schedules')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        classId,
        dayOfWeek: 2,
        startTime: '08:00',
        endTime: '10:00'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.dayOfWeek).toBe(2);
        scheduleId = res.body.data.id;
      });
  });

  it('/schedules (GET) - Get All Schedules', () => {
    return request(app.getHttpServer())
      .get('/schedules')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/schedules/class/:classId (GET) - Get Class Schedules', () => {
    return request(app.getHttpServer())
      .get(`/schedules/class/${classId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some((s: any) => s.id === scheduleId)).toBe(true);
      });
  });

  it('/schedules/:id (DELETE) - Remove Schedule', () => {
    return request(app.getHttpServer())
      .delete(`/schedules/${scheduleId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
