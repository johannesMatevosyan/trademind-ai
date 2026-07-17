import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    mkdir,
    unlink,
    writeFile,
} from 'node:fs/promises';
import { basename, join } from 'node:path';

import type {
    FileStorageService,
    SaveFileInput,
} from './file-storage.interface';
import {
    TRADE_IMAGES_DIRECTORY,
    TRADE_IMAGES_PUBLIC_PATH,
} from './storage.constants';

@Injectable()
export class LocalFileStorageService
  implements FileStorageService
{
  async save({
    buffer,
    storageKey,
  }: SaveFileInput): Promise<void> {
    const safeStorageKey =
      this.normalizeStorageKey(storageKey);

    try {
      await mkdir(TRADE_IMAGES_DIRECTORY, {
        recursive: true,
      });

      const destinationPath = join(
        TRADE_IMAGES_DIRECTORY,
        safeStorageKey,
      );

      await writeFile(destinationPath, buffer, {
        flag: 'wx',
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to save the uploaded file.',
        {
          cause: error,
        },
      );
    }
  }

  async delete(storageKey: string): Promise<void> {
    const safeStorageKey =
      this.normalizeStorageKey(storageKey);

    const filePath = join(
      TRADE_IMAGES_DIRECTORY,
      safeStorageKey,
    );

    try {
      await unlink(filePath);
    } catch (error) {
      if (this.isFileNotFoundError(error)) {
        return;
      }

      throw new InternalServerErrorException(
        'Unable to delete the stored file.',
        {
          cause: error,
        },
      );
    }
  }

  getPublicUrl(storageKey: string): string {
    const safeStorageKey =
      this.normalizeStorageKey(storageKey);

    return `${TRADE_IMAGES_PUBLIC_PATH}/${encodeURIComponent(
      safeStorageKey,
    )}`;
  }

  private normalizeStorageKey(
    storageKey: string,
  ): string {
    const normalizedStorageKey = basename(storageKey);

    if (
      !normalizedStorageKey ||
      normalizedStorageKey !== storageKey
    ) {
      throw new InternalServerErrorException(
        'Invalid file storage key.',
      );
    }

    return normalizedStorageKey;
  }

  private isFileNotFoundError(
    error: unknown,
  ): error is NodeJS.ErrnoException {
    return (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    );
  }
}
