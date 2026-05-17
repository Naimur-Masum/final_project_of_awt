import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'ভ্যালিড ইমেইল অ্যাড্রেস প্রদান করুন' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP অবশ্যই ৬ ডিজিটের হতে হবে' })
  otp: string;

  @IsString()
  @MinLength(6, { message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার লম্বা হতে হবে' })
  newPassword: string;
}