import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';
import * as cron from 'node-cron';
import worker from './weather.worker';

@Module({
  imports: [UsersModule, TelegramModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule implements OnModuleInit {
  private readonly logger = new Logger(WeatherModule.name);

  constructor(private weatherService: WeatherService) {}

  onModuleInit() {
    // BullMQ worker start
    worker.on('completed', (job) => {
      this.logger.log(`Job ${job?.id} completed`);
    });

    // Cron — har 6 ghante
    cron.schedule('0 */6 * * *', async () => {
      this.logger.log('Running scheduled weather alerts...');
      await this.weatherService.scheduleAlertsForAll();
    });

    this.logger.log('BullMQ worker + cron job started');
  }
}
