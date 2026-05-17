import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateCourseDto {
  
  @IsOptional()
  @IsString({ message: 'কোর্সের নাম অবশ্যই একটি টেক্সট হতে হবে' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'ক্রেডিট অবশ্যই একটি পূর্ণসংখ্যা হতে হবে' })
  @Min(1, { message: 'ক্রেডিট কমপক্ষে ১ হতে হবে' })
  @Max(4, { message: 'ক্রেডিট সর্বোচ্চ ৪ হতে পারবে' })
  credits?: number;
}