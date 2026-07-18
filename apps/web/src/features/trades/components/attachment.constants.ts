export const MAX_TRADE_ATTACHMENTS = 10;

export const MAX_ATTACHMENT_SIZE_BYTES =
  5 * 1024 * 1024;

export const ACCEPTED_ATTACHMENT_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const ATTACHMENT_INPUT_ACCEPT =
  ACCEPTED_ATTACHMENT_MIME_TYPES.join(',');
