import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @IsBoolean({ message: 'স্ট্যাটাস অবশ্যই true অথবা false হতে হবে' })
  @IsNotEmpty({ message: 'isApproved ফিল্ডটি ফাঁকা রাখা যাবে化 না' })
  isApproved: boolean;
}