import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StockMarketApiService } from './stock-market-api.service';

@Module({
  imports: [HttpModule],
  providers: [StockMarketApiService],
  exports: [StockMarketApiService],
})
export class StockMarketApiModule {}
