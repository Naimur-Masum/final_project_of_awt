import { Controller, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollSectionDto } from './dto/EnrollSectionDto.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@Controller('enrollments')
@UseGuards(RolesGuard)
@Roles(UserRole.STUDENT) // শুধুমাত্র স্টুডেন্টরা এনরোল বা ড্রপ করতে পারবে
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enrollSection(@Request() req, @Body() dto: EnrollSectionDto) {
    // JWT টোকেন থেকে রিকোয়েস্ট করা স্টুডেন্টের আইডি নেওয়া হচ্ছে (req.user.id)
    return this.enrollmentService.enrollSection(req.user.id, dto);
  }

  @Delete(':sectionId')
  dropSection(@Request() req, @Param('sectionId') sectionId: number) {
    return this.enrollmentService.dropSection(req.user.id, sectionId);
  }
}