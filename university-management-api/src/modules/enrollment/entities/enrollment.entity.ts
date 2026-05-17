import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Section } from '../../courses/entities/section.entity';

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
}

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Section, (section) => section.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column()
  sectionId: number;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ENROLLED,
  })
  status: EnrollmentStatus;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true })
  grade: number; // CGPA ক্যালকুলেশনের জন্য গ্রেড পয়েন্ট (যেমন: 4.00, 3.75)

  @CreateDateColumn()
  enrolledAt: Date;
}