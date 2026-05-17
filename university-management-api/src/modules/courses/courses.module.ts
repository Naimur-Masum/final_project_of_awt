import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

import { Course } from './entities/course.entity';
import { Section } from './entities/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Section,
    ]),
  ],

  controllers: [CoursesController],

  providers: [CoursesService],
})
export class CoursesModule {}