import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/constants/roles.constant';

export class RegisterDto {
  @IsEmail({}, { message: 'ভ্যালিড ইমেইল অ্যাড্রেস প্রদান করুন' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার লম্বা হতে হবে' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'রোল অবশ্যই admin অথবা student হতে হবে' })
  role?: UserRole;
}