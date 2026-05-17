import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'কোর্স কোড ফাঁকা রাখা যাবে না' })
  courseCode!: string; // যেমন: CSE211

  @IsString()
  @IsNotEmpty({ message: 'কোর্সের নাম ফাঁকা রাখা যাবে না' })
  name!: string; // যেমন: Data Structures

  @IsInt()
  @Min(1, { message: 'ক্রেডিট কমপক্ষে ১ হতে হবে' })
  @Max(4, { message: 'ক্রেডিট সর্বোচ্চ ৪ হতে পারবে' })
  credits!: number;
}