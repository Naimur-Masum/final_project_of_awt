import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'ভ্যালিড ইমেইল অ্যাড্রেস প্রদান করুন' })
  email: string;
}