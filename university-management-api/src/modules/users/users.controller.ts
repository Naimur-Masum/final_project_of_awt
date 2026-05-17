import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ১. যেকোনো লগইন করা ইউজার নিজের প্রোফাইল দেখতে পারবে
  @Get('my-profile')
  getProfile(@Request() req) {
    return this.usersService.findProfile(req.user.id);
  }

  // ২. শুধুমাত্র অ্যাডমিন সব ইউজারের লিস্ট দেখতে পারবে
  @Get()
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.usersService.findAllUsers();
  }
}