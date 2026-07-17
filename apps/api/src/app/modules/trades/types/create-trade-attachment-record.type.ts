export interface CreateTradeAttachmentRecord {
  tradeId: string;
  filename: string;
  mimeType: string;
  size: number;
  storageKey: string;
}
