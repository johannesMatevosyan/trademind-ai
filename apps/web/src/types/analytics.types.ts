export interface AnalyticsOverview {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;

  totalRealizedPnl: string;
  averageRealizedPnl: string;

  winRate: number;
  lossRate: number;

  bestTradePnl: string;
  worstTradePnl: string;
}
