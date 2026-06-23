import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(
    private usersService: UsersService,
    private telegramService: TelegramService,
  ) {}

  @Get('pending')
  getPending() {
    return this.usersService.findPending();
  }

  @Get('all')
  getAll() {
    return this.usersService.findAll();
  }

  @Patch('approve/:id')
  async approve(@Param('id') id: string) {
    const user = await this.usersService.approve(id);
    if (user?.telegramChatId) {
      await this.telegramService.sendMessage(
        user.telegramChatId,
        '✅ Your WeatherGuard access has been approved!\n\nWeather alerts are now active. You will receive updates every 6 hours.',
      );
    }
    return user;
  }
}