import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';
import { UpdateTradingAccountDto } from './dto/update-trading-account.dto';

@Injectable()
export class TradingAccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findManyByUserId(userId: string) {
    return this.prisma.tradingAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return this.prisma.tradingAccount.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  create(userId: string, dto: CreateTradingAccountDto) {
    return this.prisma.tradingAccount.create({
      data: {
        name: dto.name,
        broker: dto.broker,
        currency: dto.currency.toUpperCase(),
        userId,
      },
    });
  }

  update(id: string, userId: string, dto: UpdateTradingAccountDto) {
    return this.prisma.tradingAccount.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.broker !== undefined && { broker: dto.broker }),
        ...(dto.currency !== undefined && {
          currency: dto.currency.toUpperCase(),
        }),
      },
    });
  }

  delete(id: string) {
    return this.prisma.tradingAccount.delete({
      where: { id },
    });
  }
}
