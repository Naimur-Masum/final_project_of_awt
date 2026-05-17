import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      // রিকোয়েস্ট হেডার থেকে Bearer টোকেনটি এক্সট্রাক্ট করবে
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // টোকেনের মেয়াদ শেষ হয়ে গেলে রিকোয়েস্ট রিজেক্ট করবে
      ignoreExpiration: false,
      // টোকেনটি ভেরিফাই করার জন্য .env ফাইলের সিক্রেট কি ব্যবহার করবে
      secretOrKey: process.env.JWT_SECRET || 'mySuperSecretKey123456789',
    });
  }

  // টোকেনটি সঠিক হলে এই ফাংশনটি অটোমেটিক রান হবে এবং পে-লোড ডিকোড করবে
  async validate(payload: any) {
    // পে-লোডের 'sub' (যা মূলত ইউজার আইডি) দিয়ে ডাটাবেসে ইউজারকে খুঁজবে
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    
    if (!user) {
      throw new UnauthorizedException('টোকেনটি বৈধ নয় বা ইউজার পাওয়া যায়নি');
    }

    // ইউজার যদি এপ্রুভড না থাকে তবে তাকে ব্লক করবে
    if (!user.isApproved) {
      throw new UnauthorizedException('আপনার অ্যাকাউন্টটি এখনও অ্যাডমিন দ্বারা অনুমোদিত হয়নি');
    }

    // এই রিটার্ন করা ইউজার অবজেক্টটিই পরবর্তী কন্ট্রোলারগুলোতে `req.user` হিসেবে পাওয়া যাবে
    return user;
  }
}