import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Students Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let studentId: string;

  const testUser = {
    username: `admin_student_${Date.now()}`,
    password: 'Password123!',
    fullName: 'Admin Student Test',
  };

  const testStudent = {
    fullName: 'Nguyen Van A',
    dateOfBirth: '2000-01-01',
    gender: 'Nam',
    address: 'Hanoi',
    phoneNumber: '0123456789',
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

    // Login to get token
    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    authToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/students (POST) - Create Student', () => {
    return request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testStudent)
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.fullName).toBe(testStudent.fullName);
        studentId = res.body.data.id;
      });
  });

  it('/students (GET) - Get All Students', () => {
    return request(app.getHttpServer())
      .get('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/students/:id (GET) - Get One Student', () => {
    return request(app.getHttpServer())
      .get(`/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toBe(studentId);
      });
  });

  it('/students/:id (PATCH) - Update Student', () => {
    return request(app.getHttpServer())
      .patch(`/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ fullName: 'Nguyen Van B (Updated)' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.fullName).toBe('Nguyen Van B (Updated)');
      });
  });

  it('/students/:id (DELETE) - Delete Student', () => {
    return request(app.getHttpServer())
      .delete(`/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
});
