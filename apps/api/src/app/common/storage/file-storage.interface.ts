import { join } from 'node:path';

export const FILE_STORAGE_SERVICE = Symbol(
  'FILE_STORAGE_SERVICE',
);

export const UPLOADS_ROOT_DIRECTORY = join(
  process.cwd(),
  'uploads',
);

export const TRADE_IMAGES_DIRECTORY_NAME = 'trade-images';

export const TRADE_IMAGES_DIRECTORY = join(
  UPLOADS_ROOT_DIRECTORY,
  TRADE_IMAGES_DIRECTORY_NAME,
);

export const TRADE_IMAGES_PUBLIC_PATH =
  '/api/uploads/trade-images';

export interface SaveFileInput {
  buffer: Buffer;
  storageKey: string;
}

export interface FileStorageService {
  save(input: SaveFileInput): Promise<void>;

  delete(storageKey: string): Promise<void>;

  getPublicUrl(storageKey: string): string;
}
