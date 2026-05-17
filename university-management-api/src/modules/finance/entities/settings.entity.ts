import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('global_settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 5000.00 })
  creditFee: number; // প্রতি ক্রেডিটের ফি (যেমন: ৫০০০ টাকা)

  @Column({ default: 'Summer 2025-2026' })
  currentSemester: string; // বর্তমান চলমান সেমিস্টার

  @UpdateDateColumn()
  updatedAt: Date;
}