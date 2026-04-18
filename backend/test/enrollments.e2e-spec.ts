import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Enrollments Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let studentId: string;
  let classId: string;
  let enrollmentId: string;

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
      username: `admin_enroll_${Date.now()}`,
      password: 'Password123!',
      fullName: 'Admin Enroll Test',
    };
    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    authToken = loginRes.body.data.accessToken;

    // Create a student
    const studentRes = await request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        fullName: 'Enrollment Test Student',
      });
    studentId = studentRes.body.data.id;

    // Create a class
    const classRes = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ className: `Class_Enroll_${Date.now()}` });
    classId = classRes.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/enrollments (POST) - Enroll Student', () => {
    return request(app.getHttpServer())
      .post('/enrollments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ studentId, classId })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.student.id).toBe(studentId);
        expect(res.body.data.class.id).toBe(classId);
        enrollmentId = res.body.data.id;
      });
  });

  it('/enrollments (GET) - Get All Enrollments', () => {
    return request(app.getHttpServer())
      .get('/enrollments')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/enrollments/:id/status (PATCH) - Update Enrollment Status', () => {
    return request(app.getHttpServer())
      .patch(`/enrollments/${enrollmentId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'INACTIVE' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toBe('INACTIVE');
      });
  });

  it('/enrollments/:id (DELETE) - Remove Enrollment', () => {
    return request(app.getHttpServer())
      .delete(`/enrollments/${enrollmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
