import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { Section } from '../courses/entities/section.entity';
import { EnrollSectionDto } from './dto/EnrollSectionDto.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
  ) {}

  async enrollSection(studentId: number, dto: EnrollSectionDto) {
    const section = await this.sectionRepo.findOne({ where: { id: dto.sectionId }, relations: ['course'] });
    if (!section) throw new NotFoundException('সেকশনটি পাওয়া যায়নি');

    if (section.enrolledCount >= section.capacity) {
      throw new BadRequestException('এই সেকশনে কোনো সিট খালি নেই');
    }

    // চেক করা হচ্ছে স্টুডেন্ট ইতিমধ্যে এই কোর্সের কোনো সেকশনে এনরোলড আছে কি না
    const existingEnrollment = await this.enrollmentRepo.findOne({
      where: {
        studentId: studentId,
        section: { courseId: section.courseId },
        status: EnrollmentStatus.ENROLLED,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('আপনি ইতিমধ্যে এই কোর্সের একটি সেকশনে যুক্ত আছেন');
    }

    const enrollment = this.enrollmentRepo.create({
      studentId,
      sectionId: dto.sectionId,
    });

    await this.enrollmentRepo.save(enrollment);

    // সেকশনের কারেন্ট কাউন্ট বাড়িয়ে দেওয়া হচ্ছে
    section.enrolledCount += 1;
    await this.sectionRepo.save(section);

    return { message: 'সফলভাবে সেকশনে এনরোল করা হয়েছে' };
  }

  async dropSection(studentId: number, sectionId: number) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { studentId, sectionId, status: EnrollmentStatus.ENROLLED },
    });

    if (!enrollment) throw new NotFoundException('কোনো সক্রিয় এনরোলমেন্ট রেকর্ড পাওয়া যায়নি');

    enrollment.status = EnrollmentStatus.DROPPED;
    await this.enrollmentRepo.save(enrollment);

    const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
    if (section && section.enrolledCount > 0) {
      section.enrolledCount -= 1;
      await this.sectionRepo.save(section);
    }

    return { message: 'কোর্সটি সফলভাবে ড্রপ করা হয়েছে' };
  }
}