import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

import type { FileStorageService } from '../../common/storage/file-storage.interface';
import {
    FILE_STORAGE_SERVICE,
    MAX_TRADE_ATTACHMENTS_PER_TRADE,
    MAX_TRADE_ATTACHMENT_SIZE_BYTES,
    SUPPORTED_TRADE_ATTACHMENT_MIME_TYPES,
} from '../../common/storage/storage.constants';
import { TradesRepository } from './trades.repository';
import type { UploadedTradeAttachment } from './types/uploaded-trade-attachment.type';

@Injectable()
export class TradeAttachmentsService {
    constructor(
        private readonly tradesRepository: TradesRepository,

        @Inject(FILE_STORAGE_SERVICE)
        private readonly fileStorageService: FileStorageService,
    ) {}

    async findAll(
        tradeId: string,
        userId: string,
    ) {
        await this.assertTradeOwnership(tradeId, userId);

        const attachments =
        await this.tradesRepository.findTradeAttachments(
            tradeId,
            userId,
        );

        return attachments.map((attachment) =>
        this.toResponse(attachment),
        );
    }

    async upload(
        tradeId: string,
        userId: string,
        files: UploadedTradeAttachment[],
    ) {
        if (!files.length) {
            throw new BadRequestException(
            'At least one image must be selected.',
            );
        }

        const currentCount = await this.getAttachmentCount(
            tradeId,
            userId,
        );

        if (
            currentCount + files.length >
            MAX_TRADE_ATTACHMENTS_PER_TRADE
        ) {
            const remaining =
            MAX_TRADE_ATTACHMENTS_PER_TRADE - currentCount;

            throw new BadRequestException(
            `You can upload only ${remaining} more attachment${remaining === 1 ? '' : 's'} for this trade.`,
            );
        }

        files.forEach((file) => this.validateFile(file));

        const createdAttachments: Array<{
            id: string;
            storageKey: string;
        }> = [];

        try {
            for (const file of files) {
            const storageKey = this.createStorageKey(
                file.mimetype,
            );

            await this.fileStorageService.save({
                buffer: file.buffer,
                storageKey,
            });

            try {
                const attachment =
                await this.tradesRepository.createTradeAttachment({
                    tradeId,
                    filename: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    storageKey,
                });

                createdAttachments.push({
                id: attachment.id,
                storageKey: attachment.storageKey,
                });
            } catch (error) {
                await this.fileStorageService.delete(storageKey);
                throw error;
            }
            }

            const attachments =
            await this.tradesRepository.findTradeAttachments(
                tradeId,
                userId,
            );

            const createdAttachmentIds = new Set(
            createdAttachments.map(
                (attachment) => attachment.id,
            ),
            );

            return attachments
            .filter((attachment) =>
                createdAttachmentIds.has(attachment.id),
            )
            .map((attachment) =>
                this.toResponse(attachment),
            );
        } catch (error) {
            await Promise.allSettled(
            createdAttachments.map(async (attachment) => {
                await this.fileStorageService.delete(
                attachment.storageKey,
                );

                await this.tradesRepository.deleteTradeAttachment(
                attachment.id,
                );
            }),
            );

            throw error;
        }
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

    async remove(
        tradeId: string,
        attachmentId: string,
        userId: string,
    ) {
        const attachment = await this.findOne(
        tradeId,
        attachmentId,
        userId,
        );

        await this.fileStorageService.delete(
        attachment.storageKey,
        );

        await this.tradesRepository.deleteTradeAttachment(
        attachment.id,
        );

        return {
        id: attachment.id,
        };
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

    private validateFile(
        file: UploadedTradeAttachment,
    ): void {
        if (
            !SUPPORTED_TRADE_ATTACHMENT_MIME_TYPES.includes(
                file.mimetype as
                | 'image/png'
                | 'image/jpeg'
                | 'image/webp',
            )
        ) {
            throw new BadRequestException(
                `${file.originalname} has an unsupported file type.`,
            );
        }

        if (file.size > MAX_TRADE_ATTACHMENT_SIZE_BYTES) {
            throw new BadRequestException(
                `${file.originalname} exceeds the 5 MB limit.`,
            );
        }
    }

    private createStorageKey(mimeType: string): string {
        const extensionByMimeType: Record<string, string> = {
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'image/webp': '.webp',
        };

        const extension =
            extensionByMimeType[mimeType] ||
            extname(mimeType);

        return `${randomUUID()}${extension}`;
    }

    private toResponse(attachment: {
        id: string;
        filename: string;
        mimeType: string;
        size: number;
        storageKey: string;
        createdAt: Date;
    }) {
        return {
        id: attachment.id,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
        url: this.fileStorageService.getPublicUrl(
            attachment.storageKey,
        ),
        createdAt: attachment.createdAt,
        };
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

