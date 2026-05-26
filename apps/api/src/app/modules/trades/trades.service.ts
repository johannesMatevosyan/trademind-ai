import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma';

import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradesRepository } from './trades.repository';

@Injectable()
export class TradesService {
  constructor(private readonly tradesRepository: TradesRepository) {}

  findAll(userId: string) {
    return this.tradesRepository.findAllByUserId(userId);
  }

  async create(userId: string, dto: CreateTradeDto) {
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
        connect: { code: dto.symbol },
      },
      side: dto.side,
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
      status: dto.status,
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
}
