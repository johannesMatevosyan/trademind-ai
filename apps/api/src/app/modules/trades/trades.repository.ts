/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class TradesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUserId(userId: string) {
    return this.prisma.trade.findMany({
      where: { userId },
      orderBy: { openedAt: 'desc' },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return this.prisma.trade.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  findTradingAccountByIdAndUserId(
    tradingAccountId: string,
    userId: string,
  ) {
    return this.prisma.tradingAccount.findFirst({
      where: {
        id: tradingAccountId,
        userId,
      },
      select: {
        id: true,
        userId: true,
      },
    });
  }

  findSymbolsByCodes(codes: string[]) {
    return this.prisma.symbol.findMany({
      where: {
        code: {
          in: codes,
        },
        isActive: true,
      },
      select: {
        id: true,
        code: true,
      },
    });
  }

  createManyImportedTrades(
    trades: Prisma.TradeUncheckedCreateInput[],
  ) {
    return this.prisma.$transaction(
      trades.map((trade) =>
        this.prisma.trade.create({
          data: trade,
          select: {
            id: true,
          },
        }),
      ),
    );
  }

  create(data: Prisma.TradeCreateInput) {
    return this.prisma.trade.create({
      data,
    });
  }

  update(id: string, data: Prisma.TradeUpdateInput) { // TODO add userId argument later
    return this.prisma.trade.update({
        where: { id },
        data,
    });
  }

  delete(id: string) { // TODO add userId argument later
    return this.prisma.trade.delete({
        where: { id },
    });
  }
}
