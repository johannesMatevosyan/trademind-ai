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

export const MAX_TRADE_ATTACHMENT_SIZE_BYTES =
  5 * 1024 * 1024;

export const MAX_TRADE_ATTACHMENTS_PER_TRADE = 10;

export const SUPPORTED_TRADE_ATTACHMENT_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export type SupportedTradeAttachmentMimeType =
  (typeof SUPPORTED_TRADE_ATTACHMENT_MIME_TYPES)[number];
