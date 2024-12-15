import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SchedulerService } from '../scheduler/scheduler.service';
import { StockMarketApiService } from '../stock-market-api/stock-market-api.service';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly schedulerService: SchedulerService,
    private readonly stockMarketApiService: StockMarketApiService,
  ) {}

  async getStock(symbol: string) {
    const stocks = await this.stockRepository.find({
      where: { symbol },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    if (!stocks.length) {
      throw new NotFoundException(`No stock data found for symbol: ${symbol}`);
    }

    const latestStockInformation = stocks[stocks.length - 1];

    const last10StockPrices = stocks.map((stock) => stock.price);
    const movingAverage = this.calculateMovingAverage(last10StockPrices);

    return { ...latestStockInformation, movingAverage };
  }

  calculateMovingAverage(prices: number[]) {
    const totalPrice = prices.reduce(
      (totalPrice, currentPrice) => totalPrice + currentPrice,
      0,
    );
    return totalPrice / prices.length;
  }

  startScheduledChecker(symbol: string) {
    this.schedulerService.start(symbol, async () => {
      try {
        const response =
          await this.stockMarketApiService.getLatestStockPrice(symbol);
        const price = response.c;

        if (!price) {
          this.schedulerService.stop(symbol);
          throw new BadRequestException(`Invalid symbol: ${symbol}`);
        }

        const stock = this.stockRepository.create({ symbol, price });
        await this.stockRepository.save(stock);

        this.logger.log(`Fetched and saved price for ${symbol}: ${price}`);
      } catch (error) {
        this.logger.error(
          `Error fetching data for ${symbol}: ${error.message}`,
        );

        if (error instanceof BadRequestException) {
          throw error;
        } else {
          throw new InternalServerErrorException(
            `Error fetching data for ${symbol}`,
          );
        }
      }
    });
  }
}
