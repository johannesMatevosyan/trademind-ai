import { Module } from '@nestjs/common';
import { TradeAttachmentsController } from './trade-attachments.controller';
import { TradeAttachmentsService } from './trade-attachments.service';

import { StorageModule } from '../../common/storage/storage.module';
import { TradesController } from './trades.controller';
import { TradesRepository } from './trades.repository';
import { TradesService } from './trades.service';

@Module({
  controllers: [
    TradesController,
    TradeAttachmentsController
  ],
  providers: [
    TradesService,
    TradesRepository,
    TradeAttachmentsService
  ],
  imports: [StorageModule],
})
export class TradesModule {}
