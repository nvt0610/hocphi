import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Schedule } from './schedule.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_name', length: 50, unique: true })
  className: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'monthly_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyFee: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];
}
