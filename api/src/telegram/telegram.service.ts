import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private usersService: UsersService) {}

  

  onModuleInit() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, {
      polling: true,
    });

    this.bot.onText(/\/start (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id.toString();
      const email = match[1].trim();
      try {
        await this.usersService.saveTelegramId(email, chatId);
        await this.bot.sendMessage(
          chatId,
          `✅ Telegram linked!\n\nEmail: ${email}\n\nYou will receive alerts once approved.`,
        );
        this.logger.log(`Linked: ${email} → ${chatId}`);
      } catch {
        await this.bot.sendMessage(chatId, '❌ Could not link. Check your email.');
      }
    });

    this.bot.onText(/^\/start$/, async (msg: any) => {
      await this.bot.sendMessage(
        msg.chat.id,
        '👋 Welcome!\n\nSend: /start your@email.com to link your account.',
      );
    });

    this.logger.log('Telegram bot started');
    this.bot.on('polling_error', (error: any) => {
  console.error('POLLING ERROR:', error);
});

this.bot.on('error', (error: any) => {
  console.error('BOT ERROR:', error);
});
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, text);
    } catch (err: any) {
      this.logger.error(`Failed: ${err.message}`);
    }
  }
}