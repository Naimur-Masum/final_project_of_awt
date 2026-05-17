import { Controller, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@Controller('finance')
@UseGuards(AuthGuard('jwt'), RolesGuard) // পুরো কন্ট্রোলারে সিকিউরিটি গার্ড অ্যাপ্লাই করা হলো
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // =========================================================
  // ১. STUDENT ENDPOINT: স্টুডেন্ট নিজের সেমিস্টার বিল দেখবে
  // =========================================================
  @Get('my-bill')
  @Roles(UserRole.STUDENT) // শুধুমাত্র STUDENT রোলের ইউজাররা এটি অ্যাক্সেস করতে পারবে
  getMyBill(@Request() req) {
    // JWT টোকেন থেকে ডিকোড হওয়া লগইন করা স্টুডেন্টের আইডি (req.user.id) পাস করা হচ্ছে
    return this.financeService.calculateStudentBill(req.user.id);
  }

  // =========================================================
  // ২. ADMIN ENDPOINT: অ্যাডমিন গ্লোবাল ক্রেডিট ফি ও সেমিস্টার আপডেট করবে
  // =========================================================
  @Patch('global-settings')
  @Roles(UserRole.ADMIN) // শুধুমাত্র ADMIN রোলের ইউজাররা এটি অ্যাক্সেস করতে পারবে
  updateSettings(
    @Body('creditFee') creditFee?: number,
    @Body('currentSemester') currentSemester?: string,
  ) {
    // বডি থেকে আসা ডাটা সার্ভিসে পাঠানো হচ্ছে আপডেটের জন্য
    return this.financeService.updateGlobalSettings(creditFee, currentSemester);
  }
}