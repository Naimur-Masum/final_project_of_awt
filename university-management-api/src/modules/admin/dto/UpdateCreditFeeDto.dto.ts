import { IsNumber, Min } from 'class-validator';

export class UpdateCreditFeeDto {
  @IsNumber({}, { message: 'ক্রেডিট ফি অবশ্যই একটি সংখ্যা হতে হবে' })
  @Min(0, { message: 'ক্রেডিট ফি নেগেটিভ হতে পারবে না' })
  creditFee: number;
}