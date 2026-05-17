import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '1d' },
    }),

    MailerModule,
  ],

  controllers: [AuthController],

  providers: [AuthService],
})
export class AuthModule {}