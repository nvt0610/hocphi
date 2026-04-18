import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
  Index,
} from 'typeorm';
import { Student } from './student.entity';
import { Enrollment } from './enrollment.entity';

export type TuitionStatus = 'Paid' | 'Unpaid';

@Entity('tuition_records')
@Check(`"status" IN ('Paid', 'Unpaid')`)
@Index('idx_tuition_student', ['studentId'])
export class TuitionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'enrollment_id', nullable: true })
  enrollmentId: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'billing_month', length: 7, nullable: true })
  billingMonth: string; // Format: YYYY-MM

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({
    name: 'payment_date',
    type: 'timestamptz',
    nullable: true,
  })
  paymentDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'Unpaid' })
  status: 'Paid' | 'Unpaid';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Student, (student) => student.tuitionRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Enrollment, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;
}
