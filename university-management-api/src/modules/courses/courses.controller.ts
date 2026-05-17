import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/CreateCourseDto.dto';
import { CreateSectionDto } from './dto/CreateSectionDto.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Post('sections')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createSection(@Body() dto: CreateSectionDto) {
    return this.coursesService.createSection(dto);
  }

  @Get()
  findAllCourses() {
    return this.coursesService.findAllCourses();
  }
}