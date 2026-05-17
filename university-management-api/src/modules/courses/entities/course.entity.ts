import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Section } from './section.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  courseCode!: string; // যেমন: CSE211, CSE112

  @Column()
  name!: string; // যেমন: Data Structures

  @Column({ type: 'int' })
  credits!: number; // যেমন: 3 বা 4

  @OneToMany(() => Section, (section) => section.course, { cascade: true })
  sections!: Section[];

  @CreateDateColumn()
  createdAt!: Date;
}