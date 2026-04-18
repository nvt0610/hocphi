import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
  Index,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

export type EnrollmentStatus = 'ACTIVE' | 'INACTIVE';

@Entity('enrollments')
@Unique(['studentId', 'classId'])
@Check(`"status" IN ('ACTIVE', 'INACTIVE')`)
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'class_id' })
  classId: string;

  @Index('idx_enrollments_status')
  @Column({
    type: 'varchar',
    length: 20,
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (classEntity) => classEntity.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
