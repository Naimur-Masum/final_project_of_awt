import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'ভ্যালিড ইমেইল অ্যাড্রেস প্রদান করুন' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'পাসওয়ার্ডটি সঠিক ফরম্যাটে দিন' })
  password: string;
}