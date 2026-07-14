export const TRADE_SIDES = ['BUY', 'SELL'] as const;

export type TradeSide = (typeof TRADE_SIDES)[number];

export const TRADE_STATUSES = [
  'OPEN',
  'CLOSED',
  'CANCELLED',
] as const;

export type TradeStatus = (typeof TRADE_STATUSES)[number];

export const TRADE_CSV_HEADERS = [
  'symbol',
  'side',
  'status',
  'quantity',
  'entryPrice',
  'exitPrice',
  'openedAt',
  'closedAt',
  'notes',
] as const;

export type TradeCsvHeader =
  (typeof TRADE_CSV_HEADERS)[number];

export interface CsvImportRequest {
  tradingAccountId: string;
  rows: CsvTradeImportRow[];
}

export interface CsvImportResult {
  importedCount: number;
  rejectedCount: number;
  importedTradeIds: string[];
  errors: CsvImportRowError[];
}
export interface RawCsvTradeRow {
  symbol?: string;
  side?: string;
  status?: string;
  quantity?: string;
  entryPrice?: string;
  exitPrice?: string;
  openedAt?: string;
  closedAt?: string;
  notes?: string;
}

export interface CsvTradeImportRow {
  rowNumber: number;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;
  quantity: string;
  entryPrice: string;
  exitPrice: string | null;
  openedAt: string;
  closedAt: string | null;
  notes: string | null;
}

export interface CsvImportRowError {
  rowNumber: number;
  field?: string;
  message: string;
}

export interface CsvImportPreviewRow {
  rowNumber: number;
  raw: RawCsvTradeRow;
  normalized: CsvTradeImportRow | null;
  errors: CsvImportRowError[];
  isValid: boolean;
}

export interface CsvParseResult {
  fileName: string;
  totalRows: number;
  validRows: CsvTradeImportRow[];
  invalidRows: CsvImportPreviewRow[];
  rows: CsvImportPreviewRow[];
  errors: string[];
}

export interface TradingAccountOption {
  id: string;
  name: string;
  broker?: string | null;
  currency?: string;
}
