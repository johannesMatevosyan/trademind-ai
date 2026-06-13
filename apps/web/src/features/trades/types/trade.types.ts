export type TradeSide = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface TradeSymbol {
  id: string;
  code?: string | null;
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
  notes?: string | null;
  tradingAccountId: string;
  symbolId: string;
  symbol?: TradeSymbol | null;
}
