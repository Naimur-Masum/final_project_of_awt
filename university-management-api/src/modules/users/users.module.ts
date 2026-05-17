import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // কন্ট্রোলার ইমপোর্ট
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // এখানে কন্ট্রোলার যুক্ত করা হলো
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}