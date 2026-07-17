import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/auth-user.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TradeAttachmentsService } from './trade-attachments.service';

@Controller('trades/:tradeId/attachments')
@UseGuards(JwtAuthGuard)
export class TradeAttachmentsController {
  constructor(
    private readonly tradeAttachmentsService:
      TradeAttachmentsService,
  ) {}

  @Get()
  findAll(
    @Param('tradeId') tradeId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tradeAttachmentsService.findAll(
      tradeId,
      user.id,
    );
  }
}
