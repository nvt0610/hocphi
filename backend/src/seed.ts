import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';
import { Enrollment } from './entities/enrollment.entity';
import { TuitionRecord } from './entities/tuition-record.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'hocphi_db',
  entities: [User, Student, Class, Schedule, Enrollment, TuitionRecord],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to DB');

  const userRepository = AppDataSource.getRepository(User);
  const studentRepository = AppDataSource.getRepository(Student);
  const classRepository = AppDataSource.getRepository(Class);
  const scheduleRepository = AppDataSource.getRepository(Schedule);
  const enrollmentRepository = AppDataSource.getRepository(Enrollment);
  const tuitionRepository = AppDataSource.getRepository(TuitionRecord);

  console.log('Cleaning up existing data...');
  await tuitionRepository.createQueryBuilder().delete().execute();
  await enrollmentRepository.createQueryBuilder().delete().execute();
  await scheduleRepository.createQueryBuilder().delete().execute();
  await classRepository.createQueryBuilder().delete().execute();
  await studentRepository.createQueryBuilder().delete().execute();
  await userRepository.createQueryBuilder().delete().execute();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('staff123', 10);
  await userRepository.save(
    userRepository.create({
      username: 'staff',
      password: hashedPassword,
      fullName: 'Quản trị viên',
      role: 'staff',
    }),
  );

  console.log('Seeding classes with tuition fees...');
  const classesData = [
    { className: 'Piano K01', monthlyFee: 1500000, description: 'Lớp Piano cơ bản' },
    { className: 'Vocal V02', monthlyFee: 2000000, description: 'Lớp Thanh nhạc nâng cao' },
    { className: 'Guitar G05', monthlyFee: 1200000, description: 'Lớp Guitar đệm hát' },
    { className: 'Drawing A01', monthlyFee: 800000, description: 'Lớp Vẽ màu nước' },
    { className: 'Violin S03', monthlyFee: 2500000, description: 'Lớp Violin cổ điển' },
  ];
  const savedClasses = await classRepository.save(classRepository.create(classesData));

  console.log('Seeding schedules...');
  const schedulesData = [
    { class: savedClasses[0], dayOfWeek: 2, startTime: '08:00:00', endTime: '10:00:00' },
    { class: savedClasses[0], dayOfWeek: 4, startTime: '08:00:00', endTime: '10:00:00' },
    { class: savedClasses[1], dayOfWeek: 3, startTime: '14:00:00', endTime: '16:00:00' },
    { class: savedClasses[2], dayOfWeek: 7, startTime: '18:30:00', endTime: '20:30:00' },
  ];
  await scheduleRepository.save(scheduleRepository.create(schedulesData));

  console.log('Seeding students...');
  const studentsData = [
    { fullName: 'Nguyễn Văn An', gender: 'Nam', phoneNumber: '0901234567' },
    { fullName: 'Trần Thị Bình', gender: 'Nữ', phoneNumber: '0901112223' },
    { fullName: 'Lê Hoàng Nam', gender: 'Nam', phoneNumber: '0903334445' },
    { fullName: 'Phạm Minh Tuyết', gender: 'Nữ', phoneNumber: '0905556667' },
  ];
  const savedStudents = await studentRepository.save(studentRepository.create(studentsData));

  console.log('Seeding enrollments...');
  const enrollmentsData = [
    { student: savedStudents[0], class: savedClasses[0], status: 'ACTIVE' },
    { student: savedStudents[1], class: savedClasses[0], status: 'ACTIVE' },
    { student: savedStudents[2], class: savedClasses[1], status: 'ACTIVE' },
    { student: savedStudents[3], class: savedClasses[2], status: 'ACTIVE' },
  ];
  const savedEnrollments = await enrollmentRepository.save(enrollmentRepository.create(enrollmentsData as any));

  console.log('Seeding tuition records derived from class fees...');
  const tuitionsData = [
    { 
      student: savedStudents[0], 
      enrollment: savedEnrollments[0],
      amount: savedClasses[0].monthlyFee, 
      status: 'Paid', 
      billingMonth: '2024-04',
      content: 'Học phí lớp Piano K01 - Tháng 04/2024'
    },
    { 
      student: savedStudents[1], 
      enrollment: savedEnrollments[1],
      amount: savedClasses[0].monthlyFee, 
      status: 'Unpaid', 
      billingMonth: '2024-04',
      content: 'Học phí lớp Piano K01 - Tháng 04/2024'
    },
    { 
      student: savedStudents[2], 
      enrollment: savedEnrollments[2],
      amount: savedClasses[1].monthlyFee, 
      status: 'Paid', 
      billingMonth: '2024-04',
      content: 'Học phí lớp Vocal V02 - Tháng 04/2024'
    },
    { 
      student: savedStudents[3], 
      enrollment: savedEnrollments[3],
      amount: savedClasses[2].monthlyFee, 
      status: 'Unpaid', 
      billingMonth: '2024-04',
      content: 'Học phí lớp Guitar G05 - Tháng 04/2024'
    },
  ];
  await tuitionRepository.save(tuitionRepository.create(tuitionsData as any));

  console.log('Seed completed successfully!');
  await AppDataSource.destroy();
  process.exit();
}

seed().catch((err) => {
  console.error('Error during seed:', err);
  process.exit(1);
});
