# TradeMind AI

AI-Powered Trading Journal & Analytics Platform

TradeMind AI is a modern SaaS platform designed for traders who want to track, analyze, and improve their trading performance through intelligent journaling, portfolio analytics, and AI-driven insights.

The platform helps traders move beyond spreadsheets by automatically collecting trading data, calculating performance metrics, identifying behavioral patterns, and providing actionable recommendations.

---

## 🚀 Vision

Most traders focus on entries and exits.

Professional traders focus on data.

TradeMind AI aims to become an intelligent trading companion that helps users:

* Track every trade
* Analyze performance across accounts
* Discover profitable patterns
* Identify mistakes
* Build repeatable trading processes
* Receive AI-generated trading insights

---

## ✨ Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected API Routes
* User Profile Endpoint

### Trading Journal

* Create Trades
* Edit Trades
* Delete Trades
* Track Trade Status
* Track Position Side
* Store Entry & Exit Prices
* Track Risk / Reward
* Calculate PnL

### Trading Accounts

* Multiple Trading Accounts
* Account Management
* Account-based Analytics
* User-specific Data Isolation

### Analytics Dashboard

* Total PnL
* Win Rate
* Average Reward-to-Risk
* Trade Distribution
* Best Performing Symbols
* Performance Trends

### AI Features (Roadmap)

* AI Trade Reviews
* Mistake Detection
* Emotional Pattern Analysis
* Performance Coaching
* Trading Recommendations
* AI Chat Assistant

---

# 🏗 Architecture

TradeMind AI is built as a modern Nx Monorepo.

```text
trademind-ai/
│
├── apps/
│   ├── web/                # Next.js Frontend
│   ├── api/                # NestJS Backend
│   ├── web-e2e/
│   └── api-e2e/
│
├── libs/
│   ├── models/
│   ├── shared-ui/
│   └── shared-test-utils/
│
├── prisma/
│
└── nx.json
```

---

# 🛠 Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* React Query
* Zustand

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* REST API

## Monorepo

* Nx Workspace

## DevOps

* GitHub Actions
* Docker (Planned)
* Vercel (Planned)
* Railway / Render (Planned)

---

# 📦 Getting Started

## Prerequisites

* Node.js 20+
* PostgreSQL 15+
* npm 10+
* Nx CLI

---

## Installation

Clone repository:

```bash
git clone https://github.com/johannesMatevosyan/trademind-ai.git

cd trademind-ai
```

Install dependencies:

```bash
npm install
```

---

# ⚙ Environment Variables

Create:

```bash
apps/api/.env
```

Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trademind"

JWT_ACCESS_SECRET="your-secret-key"

JWT_ACCESS_EXPIRES_IN="15m"
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

# 🗄 Database

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# ▶ Running the Application

Start Backend:

```bash
npx nx serve @org/api
```

Backend:

```text
http://localhost:3000
```

Start Frontend:

```bash
npx nx dev @org/web
```

Frontend:

```text
http://localhost:3001
```

---

# 🧪 Testing

Run all tests:

```bash
npx nx run-many -t test
```

Run lint:

```bash
npx nx run-many -t lint
```

Build all projects:

```bash
npx nx run-many -t build
```

---

# 🔒 Authentication Flow

1. User registers
2. User logs in
3. Backend returns JWT token
4. Frontend stores token
5. Token attached to API requests
6. Protected routes validate token

---

# 📊 Current Domain Model

## User

```text
User
 ├─ id
 ├─ email
 ├─ passwordHash
 ├─ role
 └─ createdAt
```

## Trading Account

```text
TradingAccount
 ├─ id
 ├─ name
 ├─ broker
 ├─ balance
 └─ userId
```

## Trade

```text
Trade
 ├─ id
 ├─ symbol
 ├─ side
 ├─ status
 ├─ quantity
 ├─ entryPrice
 ├─ exitPrice
 ├─ pnl
 └─ accountId
```

---

# 📈 Development Roadmap

## Phase 1 — Foundation ✅

* Nx Monorepo
* Next.js Setup
* NestJS Setup
* PostgreSQL
* Prisma
* Authentication
* Trading Accounts
* Trade Journal Foundation
* Analytics Foundation

## Phase 2 — Dashboard

* Analytics UI
* Trade Table
* Filters
* Pagination
* Charts
* Performance Widgets

## Phase 3 — Advanced Analytics

* Equity Curve
* Drawdown Analysis
* Trade Distribution
* Risk Metrics
* Portfolio Insights

## Phase 4 — AI Layer

* AI Trade Review
* Trade Pattern Recognition
* Personalized Recommendations
* AI Trading Coach

## Phase 5 — SaaS

* Subscription Plans
* Stripe Integration
* Multi-Tenant Support
* Team Accounts

---

# 🤝 Contributing

1. Create a feature branch

```bash
git checkout -b feature/my-feature
```

2. Commit changes

```bash
git commit -m "feat: add my feature"
```

3. Push branch

```bash
git push origin feature/my-feature
```

4. Open Pull Request

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Hovhannes Matevosyan

Senior Frontend Engineer

Angular • React • TypeScript • Nx • NestJS

TradeMind AI © 2026
