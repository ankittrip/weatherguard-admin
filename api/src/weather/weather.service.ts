import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import axios from 'axios';
import { UsersService } from '../users/users.service';

@Injectable()
export class WeatherService {
  private queue: Queue;
  private readonly logger = new Logger(WeatherService.name);

  constructor(private usersService: UsersService) {
    this.queue = new Queue('weather-alerts', {
      connection: { url: process.env.REDIS_URL },
    });
  }

  async scheduleAlertsForAll(): Promise<void> {
    const users = await this.usersService.findApproved();
    this.logger.log(`Scheduling alerts for ${users.length} approved users`);

    for (const user of users) {
      if (user.telegramChatId) {
        await this.queue.add(
          'send-weather-alert',
          {
            chatId: user.telegramChatId,
            city: user.city || 'Delhi',
            email: user.email,
          },
          { removeOnComplete: true },
        );
      }
    }
  }

  async getWeather(city: string) {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    );
    return res.data;
  }
}