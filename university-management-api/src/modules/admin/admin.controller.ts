import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/UserStatusDto.dto';
import { UpdateCreditFeeDto } from './dto/UpdateCreditFeeDto.dto';
import { CreateCourseDto } from './dto/CreateCourseDto.dto';
import { UpdateCourseDto } from './dto/UpdateCourseCreditsDto.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN) // এই কন্ট্রোলারের সব এপিআই শুধুমাত্র অ্যাডমিনের জন্য সুরক্ষিত
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: number, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Patch('settings/credit-fee')
  updateCreditFee(@Body() dto: UpdateCreditFeeDto) {
    return this.adminService.updateCreditFee(dto);
  }

  @Patch('courses/:id')
  updateCourse(@Param('id') id: number, @Body() dto: UpdateCourseDto) {
    return this.adminService.updateCourse(id, dto);
  }
}