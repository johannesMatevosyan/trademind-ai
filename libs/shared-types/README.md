# @org/shared-types

Shared TypeScript types, interfaces, enums, DTO contracts, and domain models used across the TradeMind AI monorepo.

This library serves as the single source of truth for type definitions shared between frontend and backend applications.

---

# 🎯 Purpose

As TradeMind AI grows, both the frontend and backend need to agree on the shape of data being exchanged.

Instead of duplicating interfaces in multiple applications, shared-types provides a centralized location for:

* API Contracts
* Domain Models
* DTO Types
* Enums
* Utility Types
* Analytics Models

This approach improves:

* Type Safety
* Developer Experience
* Refactoring Confidence
* Code Reusability
* API Consistency

---

# 🏗 Library Structure

```text
shared-types/
│
├── src/
│   ├── auth/
│   ├── users/
│   ├── trades/
│   ├── trading-accounts/
│   ├── analytics/
│   ├── common/
│   └── index.ts
│
└── README.md
```

---

# 📦 Example Domain Types

## User

```ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
```

---

## Trading Account

```ts
export interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  balance: number;
  userId: string;
}
```

---

## Trade

```ts
export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;

  quantity: number;

  entryPrice: number;
  exitPrice?: number;

  pnl?: number;

  accountId: string;

  openedAt: string;
  closedAt?: string;
}
```

---

# 🔖 Shared Enums

## Trade Side

```ts
export enum TradeSide {
  BUY = 'BUY',
  SELL = 'SELL',
}
```

---

## Trade Status

```ts
export enum TradeStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
```

---

## User Role

```ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

---

# 🔐 Authentication Contracts

## Login Request

```ts
export interface LoginRequest {
  email: string;
  password: string;
}
```

---

## Login Response

```ts
export interface LoginResponse {
  accessToken: string;
}
```

---

## Current User Response

```ts
export interface CurrentUserResponse {
  id: string;
  email: string;
  role: UserRole;
}
```

---

# 📊 Analytics Contracts

## Analytics Overview

```ts
export interface AnalyticsOverview {
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  averagePnl: number;
}
```

---

## Symbol Performance

```ts
export interface SymbolPerformance {
  symbol: string;
  trades: number;
  pnl: number;
}
```

---

# 🚀 Usage

## Frontend

```ts
import {
  Trade,
  TradeStatus,
  AnalyticsOverview,
} from '@org/shared-types';
```

---

## Backend

```ts
import {
  Trade,
  TradeSide,
  LoginResponse,
} from '@org/shared-types';
```

---

# 📐 Design Principles

## Single Source of Truth

Every shared contract should exist in one place only.

Avoid creating duplicate interfaces inside:

* apps/web
* apps/api

---

## Framework Agnostic

Shared types should not depend on:

* React
* Next.js
* NestJS
* Prisma
* Database Models

Good:

```ts
export interface Trade {
  id: string;
  symbol: string;
}
```

Bad:

```ts
export class TradeEntity extends Prisma.Trade {}
```

---

## API First

Types should describe communication contracts between applications rather than implementation details.

Prefer:

```ts
TradeResponse
CreateTradeRequest
AnalyticsOverview
```

Over:

```ts
PrismaTrade
TradeRecord
TradeDbEntity
```

---

# ⚠ Guidelines

## Do

✅ Store shared interfaces

✅ Store shared enums

✅ Store API contracts

✅ Store reusable utility types

✅ Export everything through index.ts

---

## Don't

❌ Store React components

❌ Store NestJS decorators

❌ Store Prisma entities

❌ Store business logic

❌ Store database-specific implementations

---

# 📈 Future Additions

Planned shared contracts:

* Trade Journal DTOs
* Trading Account DTOs
* Portfolio Analytics Models
* Dashboard Widgets
* Notification Types
* AI Insight Models
* Subscription Models
* Billing Contracts

---

# 🤝 Contributing

Before adding a new type:

1. Verify it is required by multiple applications.
2. Keep it framework-agnostic.
3. Export it from the public API.
4. Follow existing naming conventions.

---

# 📄 License

MIT

Part of the TradeMind AI monorepo.
