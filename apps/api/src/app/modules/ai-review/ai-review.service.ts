import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    AI_PROVIDER,
    type AiProvider,
    type AiTradeReviewInput,
} from './providers/ai-provider.interface';
import type { AiReviewResult } from './types/ai-review-result.type';


@Injectable()
export class AiReviewService {
    constructor(
        private readonly prisma: PrismaService,

        @Inject(AI_PROVIDER)
        private readonly aiProvider: AiProvider,
    ) {}

    async generateReview(
        tradeId: string,
        userId: string,
    ): Promise<AiReviewResult> {
        const trade = await this.prisma.trade.findFirst({
            where: {
                id: tradeId,
                userId,
            },
            include: {
                attachments: true,
                symbol: {
                    select: {
                        code: true,
                    },
                },
            },
        });

        if (!trade) {
            throw new NotFoundException(
                'Trade not found.',
            );
        }

        const input: AiTradeReviewInput = {
            trade: {
                id: trade.id,
                symbol: trade.symbol?.code ?? 'Unknown',
                side: trade.side,
                status: trade.status,

                entryPrice: this.toNumber(
                    trade.entryPrice,
                ),
                exitPrice: this.toNumber(
                    trade.exitPrice,
                ),
                quantity: this.toNumber(
                    trade.quantity,
                ),
                pnl: this.toNumber(trade.pnl),

                openedAt: trade.openedAt,
                closedAt: trade.closedAt,
            },

            reflection: {
                notes: trade.notes,
                psychology: trade.psychology,
                lessonsLearned: trade.lessonsLearned,
            },

            attachments: trade.attachments.map(
                (attachment) => ({
                    id: attachment.id,
                    url: this.buildAttachmentUrl(
                        attachment.id,
                    ),
                    fileName: attachment.filename,
                    mimeType: attachment.mimeType,
                }),
            ),

            metrics: {
                rewardRiskRatio: null,
                positionSize: this.toNumber(
                    trade.quantity,
                ),
            },
        };

        return this.aiProvider.generateTradeReview(
            input,
        );
    }

    private buildAttachmentUrl(
        attachmentId: string,
    ): string {
        return `/api/trade-attachments/${attachmentId}`;
    }

    private toNumber(
        value:
        | number
        | { toNumber(): number }
        | null
        | undefined,
    ): number | null {
        if (
            value === null ||
            value === undefined
        ) {
            return null;
        }

        if (typeof value === 'number') {
            return value;
        }

        return value.toNumber();
    }
}
