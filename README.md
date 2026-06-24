# 🛡️ WeatherGuard Admin

A secure, invite-only weather alert service that connects a web-based admin dashboard to a Telegram bot.

## 🔗 Links

- **Live Demo:** https://weatherguard-admin.vercel.app
- **API:** https://weatherguard-admin.onrender.com
- **Demo Video:** https://www.loom.com/share/012d3f694bc74b0fb7c6a199f61b6f9e

---

## 🏗️ System Design

### Architecture Overview

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   React Admin   │────▶│   NestJS API          │────▶│   MongoDB       │
│   (Vercel)      │     │   (Render)            │     │   (Atlas)       │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
             ┌──────▼──────┐             ┌───────▼──────┐
             │  Telegram   │             │  BullMQ +    │
             │  Bot API    │             │  Upstash     │
             └─────────────┘             │  Redis       │
                                         └──────────────┘
```

### Database Schema

```typescript
User {
  _id:            ObjectId       // MongoDB auto-generated
  email:          string         // unique, from Google OAuth
  name:           string         // from Google profile
  avatar:         string         // Google profile picture URL
  provider:       string         // 'google' (default)
  status:         string         // 'pending' | 'approved' | 'rejected'
  telegramChatId: string         // linked via /start command
  city:           string         // for weather alerts (default: 'Delhi')
  createdAt:      Date           // auto-generated (timestamps: true)
  updatedAt:      Date           // auto-generated (timestamps: true)
}
```

---

## 🔄 Data Flow

### How Only Approved Users Receive Alerts

```
1. USER SIGNS UP
   └── Google OAuth → User created in MongoDB with status = 'pending'

2. TELEGRAM LINKING
   └── User opens @WeatherGuardAlertBot
   └── Sends: /start user@email.com
   └── Bot saves telegramChatId to user document

3. ADMIN APPROVAL
   └── Admin logs in → sees pending users in dashboard
   └── Admin clicks "Approve" → PATCH /admin/approve/:id
   └── status updated to 'approved' in MongoDB
   └── Telegram notification sent immediately to user

4. WEATHER ALERTS (Every 6 Hours)
   └── node-cron fires: '0 */6 * * *'
   └── WeatherService.scheduleAlertsForAll() called
   └── Queries MongoDB: { status: 'approved', telegramChatId: { $exists: true } }
   └── BullMQ job added for each approved user
   └── Worker fetches weather from OpenWeatherMap API
   └── Telegram message sent to user's chatId

GUARD: Only users with status='approved' AND telegramChatId are queried.
Pending/rejected users are never included in alert queries.
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| API | NestJS (Modular Architecture) |
| Frontend | React + Vite + Tailwind CSS |
| Database | MongoDB (Atlas) |
| Auth | Google OAuth 2.0 + JWT |
| Queue | BullMQ + Upstash Redis |
| Scheduler | node-cron |
| Bot | Telegram Bot API |
| Weather | OpenWeatherMap API |
| Deploy | Render (API) + Vercel (Frontend) |

---

## 📁 Project Structure

```
weatherguard/
├── api/                          # NestJS Backend
│   └── src/
│       ├── auth/                 # Google OAuth + JWT
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── google.strategy.ts
│       │   └── jwt.strategy.ts
│       ├── users/                # User management
│       │   ├── users.service.ts
│       │   ├── users.module.ts
│       │   ├── user.schema.ts
│       │   └── dto/
│       │       └── approve-user.dto.ts
│       ├── admin/                # Admin endpoints + guard
│       │   ├── admin.controller.ts
│       │   ├── admin.module.ts
│       │   └── admin.guard.ts
│       ├── telegram/             # Telegram bot integration
│       │   ├── telegram.service.ts
│       │   └── telegram.module.ts
│       └── weather/              # Weather alerts + BullMQ
│           ├── weather.service.ts
│           ├── weather.worker.ts
│           └── weather.module.ts
│
└── admin/                        # React Frontend
    └── src/
        ├── pages/
        │   ├── Login.tsx         # Google login
        │   ├── AuthCallback.tsx  # Token handler + role redirect
        │   ├── Dashboard.tsx     # Admin panel
        │   └── Status.tsx        # User pending/approved view
        ├── components/
        │   └── UserTable.tsx     # Reusable table
        ├── hooks/
        │   └── useAuth.ts        # Auth state management
        └── api/
            └── client.ts         # Axios instance
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project
- Telegram Bot (via @BotFather)
- OpenWeatherMap API key
- Upstash Redis account

### 1. Clone the repo

```bash
git clone https://github.com/ankittrip/weatherguard-admin.git
cd weatherguard-admin
```

### 2. API Setup

```bash
cd api
npm install
cp .env.example .env
```

Fill in `.env`:

```env
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your@email.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENWEATHER_API_KEY=your_openweather_key
REDIS_URL=rediss://default:...@...upstash.io:6379
FRONTEND_URL=http://localhost:5173
PORT=3000
```

```bash
npm run start:dev
```

### 3. Admin Frontend Setup

```bash
cd admin
npm install
cp .env.example .env
```

Fill in `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_ADMIN_EMAIL=your@email.com
```

```bash
npm run dev
```

### 4. Telegram Bot Setup

1. Open @WeatherGuardAlertBot on Telegram
2. Send: `/start your@email.com`
3. Your account will be linked for weather alerts

---

## 📱 Demo Flow

1. **User** visits app → Signs in with Google → Status shows "Pending"
2. **User** links Telegram: `/start email@example.com`
3. **Admin** logs in → Sees pending users → Clicks "Approve"
4. **User** receives Telegram: "✅ Access approved! Weather alerts active."
5. **Every 6 hours** → BullMQ sends weather alerts to all approved users

---

## 🔐 Security

- JWT tokens with 7-day expiry
- Admin identified by `ADMIN_EMAIL` env variable
- `AdminGuard` protects all `/admin/*` routes
- `.env` excluded from git — use `.env.example` as template
- Only `status='approved'` users receive weather alerts
