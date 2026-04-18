import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { Class } from './class.entity';

@Entity('class_schedules')
@Index('idx_schedules_class_day', ['classId', 'dayOfWeek'])
@Check(`"day_of_week" BETWEEN 2 AND 8`)
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number; // 2: Monday, ..., 8: Sunday

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Class, (classEntity) => classEntity.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
