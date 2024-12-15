import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly activeCronJobs: Map<string, cron.ScheduledTask> = new Map();

  start(symbol: string, taskCallback: () => Promise<void>) {
    if (this.activeCronJobs.has(symbol)) {
      this.logger.warn(`Cron job for symbol ${symbol} is already running.`);
      return;
    }

    const task = cron.schedule('* * * * *', taskCallback);
    this.activeCronJobs.set(symbol, task);
    this.logger.log(`Started cron job for symbol ${symbol}`);
  }

  stop(symbol: string) {
    const task = this.activeCronJobs.get(symbol);
    if (task) {
      task.stop();
      this.activeCronJobs.delete(symbol);
      this.logger.log(`Stopped cron job for symbol ${symbol}`);
    } else {
      this.logger.warn(`No cron job found for symbol ${symbol}`);
    }
  }
}
