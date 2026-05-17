import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Section } from '../courses/entities/section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrollment,
      Section,
    ]),
  ],
  providers: [EnrollmentService],
  controllers: [EnrollmentController],
})
export class EnrollmentModule {}
