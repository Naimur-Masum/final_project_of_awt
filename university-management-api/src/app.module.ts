import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';



import { AuthModule } from './modules/auth/auth.module';

import { UsersService } from './modules/users/users.service';

import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { AdminModule } from './modules/admin/admin.module';
import { FinanceModule } from './modules/finance/finance.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig),
    AuthModule,
    AdminModule,
    UsersModule,
    CoursesModule,
    EnrollmentModule,
    FinanceModule
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
