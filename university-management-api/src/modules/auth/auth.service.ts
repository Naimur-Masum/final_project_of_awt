import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/RegisterDto.dto';
import { LoginDto } from './dto/LoginDto.dto';
import { ForgotPasswordDto } from './dto/ForgetPasswordDto.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('ইমেইলটি ইতিমধ্যে ব্যবহার করা হয়েছে');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    await this.userRepository.save(user);
    return { message: 'নিবন্ধন সফল হয়েছে। অনুগ্রহ করে অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('ভুল ইমেইল বা পাসওয়ার্ড');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('ভুল ইমেইল বা পাসওয়ার্ড');

    if (!user.isApproved) throw new UnauthorizedException('আপনার অ্যাকাউন্টটি এখনও অ্যাডমিন দ্বারা অনুমোদিত হয়নি');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry
    await this.userRepository.save(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset OTP',
      html: `<h3>আপনার পাসওয়ার্ড রিসেট OTP হলো: <b>${otp}</b></h3><p>এটি ৫ মিনিট পর্যন্ত কার্যকর থাকবে।</p>`,
    });

    return { message: 'আপনার ইমেইলে OTP পাঠানো হয়েছে' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user || user.otp !== dto.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('ভুল অথবা মেয়াদোত্তীর্ণ OTP');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await this.userRepository.save(user);

    return { message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' };
  }
}