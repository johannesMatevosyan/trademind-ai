export interface TradeAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface DeleteTradeAttachmentResponse {
  id: string;
}
