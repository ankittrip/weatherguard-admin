import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { UsersModule } from '../users/users.module';
import * as cron from 'node-cron';

@Module({
  imports: [UsersModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule implements OnModuleInit {
  private readonly logger = new Logger(WeatherModule.name);

  constructor(private weatherService: WeatherService) {}

  onModuleInit() {
    // Har 6 ghante mein weather alert
    cron.schedule('0 */6 * * *', async () => {
      this.logger.log('Running scheduled weather alerts...');
      await this.weatherService.scheduleAlertsForAll();
    });

    this.logger.log('Weather cron job scheduled (every 6 hours)');
  }
}