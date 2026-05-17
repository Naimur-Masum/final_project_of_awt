import { IsInt, IsNotEmpty } from 'class-validator';

export class EnrollSectionDto {
  @IsInt()
  @IsNotEmpty({ message: 'সেকশন আইডি প্রদান করা বাধ্যতামূলক' })
  sectionId: number; 
  // এখানে studentId লাগবে না, কারণ সেটি আমরা সিকিউরিটির জন্য সরাসরি JWT Token থেকে রিট্রিভ করবো।
}