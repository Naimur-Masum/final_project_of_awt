import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Settings } from '../finance/entities/settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Settings,
      Course,
    ]),
  ],

  controllers: [AdminController],

  providers: [AdminService],
})
export class AdminModule {}