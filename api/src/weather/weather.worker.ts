import { Worker } from 'bullmq';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string);

const worker = new Worker(
  'weather-alerts',
  async (job) => {
    const { chatId, city, email } = job.data;
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    );
    const w = res.data;
    const msg =
      `🌤 *Weather Alert — ${city}*\n\n` +
      `🌡 Temperature: ${w.main.temp}°C\n` +
      `🤔 Feels like: ${w.main.feels_like}°C\n` +
      `☁️ Condition: ${w.weather[0].description}\n` +
      `💧 Humidity: ${w.main.humidity}%\n` +
      `💨 Wind: ${w.wind.speed} m/s`;
    await bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
    console.log(`Alert sent to ${email}`);
  },
  { connection: { url: process.env.REDIS_URL } },
);

worker.on('completed', (job) => {
  console.log(`Job ${job?.id} completed`);
});

worker.on('failed', (job, err: any) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default worker;