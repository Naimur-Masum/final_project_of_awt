import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  userRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // লগইন করা ইউজার (স্টুডেন্ট/অ্যাডমিন) নিজের প্রোফাইল দেখার জন্য
  async findProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['enrollments', 'enrollments.section', 'enrollments.section.course'],
    });

    if (!user) {
      throw new NotFoundException('ব্যবহারকারী পাওয়া যায়নি');
    }

    // সিকিউরিটির জন্য রেসপন্স থেকে পাসওয়ার্ড এবং ওটিপি বাদ দেওয়া হচ্ছে
    const { password, otp, otpExpiry, ...safeUser } = user;
    //await this.userRepository.save(user);

    return safeUser;
  }

  // শুধুমাত্র অ্যাডমিন যেন সব ইউজারের লিস্ট দেখতে পারে
  async findAllUsers() {
    return this.userRepo.find({
      select: ['id', 'email', 'role', 'isApproved', 'createdAt'],
      order: { id: 'ASC' },
    });
  }
}