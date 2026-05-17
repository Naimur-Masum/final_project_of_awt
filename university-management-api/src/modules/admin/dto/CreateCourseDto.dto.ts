import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'কোর্স কোড অবশ্যই একটি টেক্সট হতে হবে' })
  @IsNotEmpty({ message: 'কোর্স কোড ফাঁকা রাখা যাবে না' })
  courseCode!: string;

  @IsString({ message: 'কোর্সের নাম অবশ্যই একটি টেক্সট হতে হবে' })
  @IsNotEmpty({ message: 'কোর্সের নাম ফাঁকা রাখা যাবে না' })
  name!: string;

  @IsInt({ message: 'ক্রেডিট অবশ্যই একটি পূর্ণসংখ্যা (Integer) হতে হবে' })
  @Min(1, { message: 'ক্রেডিট কমপক্ষে ১ হতে হবে' })
  @Max(4, { message: 'ক্রেডিট সর্বোচ্চ ৪ হতে পারবে' })
  credits!: number;
}