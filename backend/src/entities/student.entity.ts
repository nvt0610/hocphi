import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { TuitionRecord } from './tuition-record.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_students_name')
  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ length: 10, nullable: true })
  gender: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'phone_number', length: 15, nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => TuitionRecord, (record) => record.student)
  tuitionRecords: TuitionRecord[];
}
