import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectionName: string; // যেমন: A, B, C

  @Column({ type: 'int' })
  capacity: number; // যেমন: 40

  @Column({ type: 'int', default: 0 })
  enrolledCount: number; // কারেন্টলি কয়জন ভর্তি আছে তা ট্র্যাক রাখার জন্য

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.section)
  enrollments: Enrollment[];
}