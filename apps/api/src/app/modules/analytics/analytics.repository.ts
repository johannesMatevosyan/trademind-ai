import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findTradingAccountByUser(accountId: string, userId: string) {
        return this.prisma.tradingAccount.findFirst({
            where: {
                id: accountId,
                userId,
            },
            select: {
                id: true,
            },
        });
    }

    findTradesByUser(userId: string, query: AnalyticsQueryDto) {
        return this.prisma.trade.findMany({
            where: this.buildTradeWhere(userId, query),
                include: {
                    symbol: true,
                },
                orderBy: {
                    openedAt: 'asc',
                },
        });
    }

    private buildTradeWhere(
        userId: string,
        query: AnalyticsQueryDto
    ): Prisma.TradeWhereInput {
        const where: Prisma.TradeWhereInput = {
            userId,
        };

        if (query.tradingAccountId) {
            where.tradingAccountId = query.tradingAccountId;
        }

        if (query.symbol) {
            where.symbol = {
                code: query.symbol,
            };
        }

        if (query.status) {
            where.status = query.status;
        }

        if (query.from || query.to) {
            where.openedAt = {};

            if (query.from) {
                where.openedAt.gte = new Date(query.from);
            }

            if (query.to) {
                where.openedAt.lte = new Date(query.to);
            }
        }

        return where;
    }
}
