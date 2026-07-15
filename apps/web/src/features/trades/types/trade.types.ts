export type TradeSide = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface TradeSymbol {
  id: string;
  code?: string | null;
}

export interface TradeReflection {
  notes: string | null;
  psychology: string | null;
  lessonsLearned: string | null;
}

export interface UpdateTradeReflectionInput {
  notes?: string;
  psychology?: string;
  lessonsLearned?: string;
}

export interface Trade {
  id: string;
  side: TradeSide;
  status: TradeStatus;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  openedAt: string;
  closedAt: string | null;

  notes: string | null;
  psychology: string | null;
  lessonsLearned: string | null;

  tradingAccountId: string;
  symbolId: string;
  symbol?: TradeSymbol | null;
}

export interface TradeDetails {
  id: string;
  symbol?: string | { id: string; code?: string | null } | null;
  tradingAccount?: {
    id: string;
    name?: string | null;
    broker?: string | null;
    currency?: string | null;
  } | null;
  tradingAccountId?: string | null;
  side?: TradeSide | null;
  status?: TradeStatus | null;
  entryPrice?: string | number | null;
  exitPrice?: string | number | null;
  quantity?: string | number | null;
  pnl?: string | number | null;
  openedAt?: string | null;
  closedAt?: string | null;

  notes?: string | null;
  psychology?: string | null;
  lessonsLearned?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
}
