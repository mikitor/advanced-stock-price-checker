import { Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { Stock } from './entities/stock.entity';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({ summary: 'Get stock price information by symbol.' })
  @ApiResponse({
    status: 200,
    description: 'Stock.',
    type: Stock,
  })
  @ApiNotFoundResponse({ description: 'Stock not found.' })
  @Get(':symbol')
  getStock(@Param('symbol') symbol: string) {
    return this.stockService.getStock(symbol);
  }

  @ApiOperation({
    summary:
      'Start a scheduler that saves the latest stock price every minute.',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock.',
  })
  @ApiNotFoundResponse({ description: 'Stock not found.' })
  @Put(':symbol')
  startScheduledChecker(@Param('symbol') symbol: string) {
    return this.stockService.startScheduledChecker(symbol);
  }
}
