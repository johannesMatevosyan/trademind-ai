import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TradeStatus } from '../../../generated/prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

export type AnalyticsTrade =
    Prisma.TradeGetPayload<{
        include: {
            symbol: true;
        };
    }>;

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRepository: AnalyticsRepository
  ) {}

  async getOverview(userId: string, query: AnalyticsQueryDto) {
    await this.validateAccountOwnershipIfNeeded(userId, query);

    const trades = await this.analyticsRepository.findTradesByUser(
      userId,
      query
    );

    const closedTrades = trades.filter(
      (trade) => trade.status === TradeStatus.CLOSED
    );

    const openTrades = trades.filter(
      (trade) => trade.status === TradeStatus.OPEN
    );

    const realizedPnls = closedTrades.map((trade) => this.toNumber(trade.pnl));

    const winningTrades = realizedPnls.filter((pnl) => pnl > 0).length;
    const losingTrades = realizedPnls.filter((pnl) => pnl < 0).length;
    const breakevenTrades = realizedPnls.filter((pnl) => pnl === 0).length;

    const totalRealizedPnl = this.sum(realizedPnls);
    const averageRealizedPnl = this.average(realizedPnls);

    return {
        totalTrades: trades.length,
        openTrades: openTrades.length,
        closedTrades: closedTrades.length,
        winningTrades,
        losingTrades,
        breakevenTrades,
        totalRealizedPnl: this.formatMoney(totalRealizedPnl),
        averageRealizedPnl: this.formatMoney(averageRealizedPnl),
        winRate: this.percentage(winningTrades, closedTrades.length),
        lossRate: this.percentage(losingTrades, closedTrades.length),
        bestTradePnl: this.formatMoney(this.max(realizedPnls)),
        worstTradePnl: this.formatMoney(this.min(realizedPnls)),
    };
  }

  async getPnl(userId: string, query: AnalyticsQueryDto) {
    await this.validateAccountOwnershipIfNeeded(userId, query);

    const trades = await this.analyticsRepository.findTradesByUser(
      userId,
      query
    );

    const closedTrades = trades.filter(
      (trade) => trade.status === TradeStatus.CLOSED && trade.closedAt
    );

    const grouped = new Map<
      string,
      {
        realizedPnl: number;
        tradeCount: number;
      }
    >();

    for (const trade of closedTrades) {
      const date = this.toDateKey(trade.closedAt as Date);
      const current = grouped.get(date) ?? {
        realizedPnl: 0,
        tradeCount: 0,
      };

      current.realizedPnl += this.toNumber(trade.pnl);
      current.tradeCount += 1;

      grouped.set(date, current);
    }

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      realizedPnl: this.formatMoney(value.realizedPnl),
      tradeCount: value.tradeCount,
    }));
  }

  async getPnlHistory(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
        status: 'CLOSED',
        pnl: {
          not: null,
        },
      },
      orderBy: {
        closedAt: 'asc',
      },
      select: {
        closedAt: true,
        pnl: true,
      },
    });

    return trades.map((trade) => ({
      date: trade.closedAt?.toISOString().slice(0, 10),
      pnl: Number(trade.pnl ?? 0),
    }));
  }

  async getSymbols(userId: string, query: AnalyticsQueryDto) {
    await this.validateAccountOwnershipIfNeeded(userId, query);

    const trades = await this.analyticsRepository.findTradesByUser(
      userId,
      query
    );

    const grouped = new Map<string, AnalyticsTrade[]>();

    for (const trade of trades) {
        const symbolCode = trade.symbol.code;

        const current = grouped.get(symbolCode) ?? [];

        current.push(trade);

        grouped.set(symbolCode, current);
    }

    return Array.from(grouped.entries())
      .map(([symbol, symbolTrades]) => {
        const closedTrades = symbolTrades.filter(
          (trade) => trade.status === TradeStatus.CLOSED
        );

        const realizedPnls = closedTrades.map((trade) =>
          this.toNumber(trade.pnl)
        );

        const winningTrades = realizedPnls.filter((pnl) => pnl > 0).length;
        const totalRealizedPnl = this.sum(realizedPnls);

        return {
          symbol,
          tradeCount: symbolTrades.length,
          closedTrades: closedTrades.length,
          totalRealizedPnl: this.formatMoney(totalRealizedPnl),
          averageRealizedPnl: this.formatMoney(this.average(realizedPnls)),
          winRate: this.percentage(winningTrades, closedTrades.length),
          bestTradePnl: this.formatMoney(this.max(realizedPnls)),
          worstTradePnl: this.formatMoney(this.min(realizedPnls)),
          sortValue: totalRealizedPnl,
        };
      })
      .sort((a, b) => b.sortValue - a.sortValue)
      .map(({ sortValue, ...item }) => item);
  }

  async getSymbolPerformance(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
        status: 'CLOSED',
      },
      include: {
        symbol: true,
      },
    });

    const grouped = new Map<string, { symbol: string; trades: number; pnl: number }>();

    for (const trade of trades) {
      const symbol = trade.symbol?.code ?? trade.symbolId;

      const current = grouped.get(symbol) ?? {
        symbol,
        trades: 0,
        pnl: 0,
      };

      current.trades += 1;
      current.pnl += Number(trade.pnl ?? 0);

      grouped.set(symbol, current);
    }

    return Array.from(grouped.values());
  }

  async getWinLoss(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
        status: 'CLOSED',
        pnl: {
          not: null,
        },
      },
      select: {
        pnl: true,
      },
    });

    const winningTrades = trades.filter((trade) => Number(trade.pnl) > 0).length;
    const losingTrades = trades.filter((trade) => Number(trade.pnl) < 0).length;
    const breakevenTrades = trades.filter((trade) => Number(trade.pnl) === 0).length;

    return {
      winningTrades,
      losingTrades,
      breakevenTrades,
      totalClosedTrades: trades.length,
    };
  }

  async getActivity(userId: string, query: AnalyticsQueryDto) {
    await this.validateAccountOwnershipIfNeeded(userId, query);

    const trades = await this.analyticsRepository.findTradesByUser(
      userId,
      query
    );

    const grouped = new Map<
      string,
      {
        openedTrades: number;
        closedTrades: number;
        symbols: Set<string>;
      }
    >();

    for (const trade of trades) {
      const date = this.toDateKey(trade.openedAt);
      const current = grouped.get(date) ?? {
        openedTrades: 0,
        closedTrades: 0,
        symbols: new Set<string>(),
      };

      current.openedTrades += 1;
      current.symbols.add(trade?.symbol?.name ?? trade.symbol.code);

      if (trade.status === TradeStatus.CLOSED) {
        current.closedTrades += 1;
      }

      grouped.set(date, current);
    }

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      openedTrades: value.openedTrades,
      closedTrades: value.closedTrades,
      symbolsTraded: Array.from(value.symbols),
    }));
  }

  async getTradingActivity(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: {
        userId,
      },
      select: {
        openedAt: true,
      },
    });

    const grouped = new Map<string, number>();

    for (const trade of trades) {
      const date = trade.openedAt.toISOString().slice(0, 10);

      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([date, trades]) => ({
      date,
      trades,
    }));
  }

  private async validateAccountOwnershipIfNeeded(
    userId: string,
    query: AnalyticsQueryDto
  ) {
    if (!query.tradingAccountId) {
      return;
    }

    const account = await this.analyticsRepository.findTradingAccountByUser(
      query.tradingAccountId,
      userId
    );

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }
  }

  private toNumber(value: unknown): number {
    if (!value) {
      return 0;
    }

    return Number(value);
  }

  private sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
  }

  private average(values: number[]): number {
    if (!values.length) {
      return 0;
    }

    return this.sum(values) / values.length;
  }

  private percentage(value: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
  }

  private max(values: number[]): number {
    if (!values.length) {
      return 0;
    }

    return Math.max(...values);
  }

  private min(values: number[]): number {
    if (!values.length) {
      return 0;
    }

    return Math.min(...values);
  }

  private formatMoney(value: number): string {
    return value.toFixed(2);
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
