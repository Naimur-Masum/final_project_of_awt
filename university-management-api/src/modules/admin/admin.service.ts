import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Settings } from '../finance/entities/settings.entity';
import { Course } from '../courses/entities/course.entity';
import { UpdateUserStatusDto } from './dto/UserStatusDto.dto';
import { UpdateCreditFeeDto } from './dto/UpdateCreditFeeDto.dto';
import { UpdateCourseDto } from './dto/UpdateCourseCreditsDto.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Settings) private settingsRepo: Repository<Settings>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}

  async updateUserStatus(userId: number, dto: UpdateUserStatusDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('ব্যবহারকারী পাওয়া যায়নি');

    user.isApproved = dto.isApproved;
    await this.userRepo.save(user);
    return { message: `ব্যবহারকারীর অ্যাকাউন্ট স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে` };
  }

  async updateCreditFee(dto: UpdateCreditFeeDto) {
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepo.create({ id: 1 });
    }
    settings.creditFee = dto.creditFee;
    return this.settingsRepo.save(settings);
  }

  async updateCourse(courseId: number, dto: UpdateCourseDto) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('কোর্সটি পাওয়া যায়নি');

    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }
}