import { TradeSide, TradeStatus } from '../../../../generated/prisma';

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

export interface CsvImportResult {
  importedCount: number;

  rejectedCount: number;

  importedTradeIds: string[];

  errors: CsvImportRowError[];
}
