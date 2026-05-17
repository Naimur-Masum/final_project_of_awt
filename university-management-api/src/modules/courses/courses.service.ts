import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Section } from './entities/section.entity';
import { CreateCourseDto } from './dto/CreateCourseDto.dto';
import { CreateSectionDto } from './dto/CreateSectionDto.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
  ) {}

  async createCourse(dto: CreateCourseDto) {
    const existing = await this.courseRepo.findOne({ where: { courseCode: dto.courseCode } });
    if (existing) throw new BadRequestException('এই কোর্স কোডটি ইতিমধ্যে সংরক্ষিত');

    const course = this.courseRepo.create(dto);
    return this.courseRepo.save(course);
  }

  async createSection(dto: CreateSectionDto) {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('কোর্সটি পাওয়া যায়নি');

    const section = this.sectionRepo.create(dto);
    return this.sectionRepo.save(section);
  }

  async findAllCourses() {
    return this.courseRepo.find({ relations: ['sections'] });
  }
}