import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Settings } from './entities/settings.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Settings,
      Enrollment,
    ]),
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
})
export class FinanceModule {}
