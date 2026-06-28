export interface PerformanceDashboardData {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalPnl: number;
  winRate: number;
  profitFactor: number | null;
}

export interface WinLossData {
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  totalClosedTrades: number;
}

export interface TradingActivityItem {
  date: string;
  trades: number;
}

export interface PnlHistoryItem {
  date: string | null;
  pnl: number;
}

export interface WinLossData {
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  totalClosedTrades: number;
}
