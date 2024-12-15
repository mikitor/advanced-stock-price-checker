import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchedulerService } from '../scheduler/scheduler.service';
import { StockMarketApiService } from '../stock-market-api/stock-market-api.service';
import { Stock } from './entities/stock.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), HttpModule],
  controllers: [StockController],
  providers: [StockService, SchedulerService, StockMarketApiService],
})
export class StockModule {}
