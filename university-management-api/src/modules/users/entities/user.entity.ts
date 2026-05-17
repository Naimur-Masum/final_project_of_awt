import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../../../common/constants/roles.constant';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // ওauth বা অন্য কারণে অপশনাল লাগতে পারে, বাট আপাতত সেভ থাকবে

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: false })
  isApproved: boolean; // অ্যাডমিন এপ্রুভালের জন্য

  @Column({ type: 'varchar', nullable: true })
  otp: string | null; // OTP স্টোর করার জন্য, পাসওয়ার্ড রিসেটের সময় ব্যবহার হবে

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date | null; // OTP এর মেয়াদ শেষ হওয়ার সময়

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}