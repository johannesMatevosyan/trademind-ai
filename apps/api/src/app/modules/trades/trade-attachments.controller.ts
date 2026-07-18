import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
    MAX_TRADE_ATTACHMENT_SIZE_BYTES,
    MAX_TRADE_ATTACHMENTS_PER_TRADE,
} from '../../common/storage/storage.constants';
import type { UploadedTradeAttachment } from './types/uploaded-trade-attachment.type';

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

    @Post()
    @UseInterceptors(
        FilesInterceptor(
        'files',
        MAX_TRADE_ATTACHMENTS_PER_TRADE,
        {
            storage: memoryStorage(),
            limits: {
            fileSize: MAX_TRADE_ATTACHMENT_SIZE_BYTES,
            },
        },
        ),
    )
    upload(
        @Param('tradeId') tradeId: string,
        @CurrentUser() user: AuthUser,
        @UploadedFiles()
        files: UploadedTradeAttachment[],
    ) {
        return this.tradeAttachmentsService.upload(
        tradeId,
        user.id,
        files ?? [],
        );
    }

    @Delete(':attachmentId')
    remove(
        @Param('tradeId') tradeId: string,
        @Param('attachmentId') attachmentId: string,
        @CurrentUser() user: AuthUser,
    ) {
        return this.tradeAttachmentsService.remove(
        tradeId,
        attachmentId,
        user.id,
        );
    }
}
