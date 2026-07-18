import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { access } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { TRADE_IMAGES_DIRECTORY } from './storage.constants';

@Controller('uploads/trade-images')
export class UploadsController {
  @Get(':storageKey')
  async getTradeImage(
    @Param('storageKey') storageKey: string,
    @Res() response: Response,
  ): Promise<void> {
    const safeStorageKey = basename(storageKey);

    if (
      !safeStorageKey ||
      safeStorageKey !== storageKey
    ) {
      throw new NotFoundException(
        'Uploaded image was not found.',
      );
    }

    const filePath = join(
      TRADE_IMAGES_DIRECTORY,
      safeStorageKey,
    );

    try {
      await access(filePath);
    } catch {
      throw new NotFoundException(
        'Uploaded image was not found.',
      );
    }

    response.sendFile(filePath);
  }
}
