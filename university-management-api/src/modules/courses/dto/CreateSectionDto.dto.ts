import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty({ message: 'সেকশনের নাম ফাঁকা রাখা যাবে না' })
  sectionName: string; // যেমন: A, B, C

  @IsInt()
  @Min(5, { message: 'সেকশনের ধারণক্ষমতা কমপক্ষে ৫ হতে হবে' })
  capacity: number; // যেমন: 40

  @IsInt()
  @IsNotEmpty({ message: 'কোর্স আইডি প্রদান করা বাধ্যতামূলক' })
  courseId: number;
}