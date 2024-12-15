import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class StockMarketApiService {
  private readonly logger = new Logger(StockMarketApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async getLatestStockPrice(symbol: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.STOCK_MARKET_API_KEY}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw new Error('An error happened while fetching stock price!');
            }),
          ),
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch stock price for ${symbol}: ${error.message}`,
      );
      throw error;
    }
  }
}
