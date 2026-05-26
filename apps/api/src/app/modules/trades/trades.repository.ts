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

  findTradingAccountByIdAndUserId(id: string, userId: string) {
    return this.prisma.tradingAccount.findFirst({
      where: {
        id,
        userId,
      },
    });
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
