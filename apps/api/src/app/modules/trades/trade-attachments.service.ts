import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { TradesRepository } from './trades.repository';

@Injectable()
export class TradeAttachmentsService {
  constructor(
    private readonly tradesRepository: TradesRepository,
  ) {}

  async findAll(
    tradeId: string,
    userId: string,
  ) {
    await this.assertTradeOwnership(tradeId, userId);

    return this.tradesRepository.findTradeAttachments(
      tradeId,
      userId,
    );
  }

  async findOne(
    tradeId: string,
    attachmentId: string,
    userId: string,
  ) {
    const attachment =
      await this.tradesRepository.findTradeAttachmentById(
        tradeId,
        attachmentId,
        userId,
      );

    if (!attachment) {
      throw new NotFoundException(
        'Trade attachment was not found.',
      );
    }

    return attachment;
  }

  async getAttachmentCount(
    tradeId: string,
    userId: string,
  ): Promise<number> {
    const trade =
      await this.tradesRepository.findTradeAttachmentOwnerRecord(
        tradeId,
        userId,
      );

    if (!trade) {
      throw new NotFoundException('Trade was not found.');
    }

    return trade._count.attachments;
  }

  private async assertTradeOwnership(
    tradeId: string,
    userId: string,
  ): Promise<void> {
    const trade =
      await this.tradesRepository.findTradeAttachmentOwnerRecord(
        tradeId,
        userId,
      );

    if (!trade) {
      throw new NotFoundException('Trade was not found.');
    }
  }
}
