import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';

@Entity('users')
@Check(`"role" IN ('admin', 'staff')`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'full_name', length: 100, nullable: true })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'staff',
  })
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
