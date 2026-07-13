/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetClass, type Prisma } from '../../../generated/prisma';

import { CreateTradeDto } from './dto/create-trade.dto';
import { ImportTradesDto } from './dto/import-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradesRepository } from './trades.repository';

@Injectable()
export class TradesService {
  constructor(private readonly tradesRepository: TradesRepository) {}

  findAll(userId: string) {
    return this.tradesRepository.findAllByUserId(userId);
  }

  async create(userId: string, dto: CreateTradeDto) {

    const pnl = this.calculatePnl({
        side: dto.side,
        entryPrice: Number(dto.entryPrice),
        exitPrice: dto.exitPrice ? Number(dto.exitPrice) : null,
        quantity: Number(dto.quantity),
        status: dto.status ?? 'OPEN',
    });

    const tradingAccount =
      await this.tradesRepository.findTradingAccountByIdAndUserId(
        dto.tradingAccountId,
        userId,
      );

    if (!tradingAccount) {
      throw new NotFoundException('Trading account not found');
    }

    const data: Prisma.TradeCreateInput = {
      user: {
        connect: { id: userId },
      },
      tradingAccount: {
        connect: { id: dto.tradingAccountId },
      },
      symbol: {
        connectOrCreate: {
          where: {
            code: dto.symbol,
          },
          create: {
            code: dto.symbol,
            assetClass: AssetClass.STOCK,
          },
        },
      },
      side: dto.side,
      pnl,
      status: dto.status ?? 'OPEN',
      entryPrice: dto.entryPrice,
      exitPrice: dto.exitPrice,
      quantity: dto.quantity,
      notes: dto.notes,
      openedAt: dto.openedAt ? new Date(dto.openedAt) : new Date(),
      closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined,
    };

    return this.tradesRepository.create(data);
  }

  async findOne(id: string, userId: string) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  async update(id: string, userId: string, dto: UpdateTradeDto) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (dto.tradingAccountId) {
      const tradingAccount =
        await this.tradesRepository.findTradingAccountByIdAndUserId(
          dto.tradingAccountId,
          userId,
        );

      if (!tradingAccount) {
        throw new NotFoundException('Trading account not found');
      }
    }

    const data: Prisma.TradeUpdateInput = {
      symbol: dto.symbol
        ? {
            connect: { code: dto.symbol },
          }
        : undefined,
      side: dto.side,
      status: dto.status ?? undefined,
      entryPrice: dto.entryPrice,
      exitPrice: dto.exitPrice,
      quantity: dto.quantity,
      notes: dto.notes,
      openedAt: dto.openedAt ? new Date(dto.openedAt) : undefined,
      closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined,
      tradingAccount: dto.tradingAccountId
        ? { connect: { id: dto.tradingAccountId } }
        : undefined,
    };

    return this.tradesRepository.update(id, data);
  }

  async remove(id: string, userId: string) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.tradesRepository.delete(id);
  }

  private calculatePnl(params: {
    side: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice?: number | null;
    quantity: number;
    status: string;
  }): number | null {
    if (
      params.status !== 'CLOSED' ||
      params.exitPrice === null ||
      params.exitPrice === undefined
    ) {
      return null;
    }

    if (params.side === 'BUY') {
      return (params.exitPrice - params.entryPrice) * params.quantity;
    }

    return (params.entryPrice - params.exitPrice) * params.quantity;
  }

  async importTrades(
    userId: string,
    dto: ImportTradesDto,
  ) {
    return {
      importedCount: 0,

      rejectedCount: dto.rows.length,

      importedTradeIds: [],

      errors: [],
    };
  }
}
