import {
    TRADE_SIDES,
    TRADE_STATUSES,
    type CsvImportPreviewRow,
    type CsvImportRowError,
    type CsvTradeImportRow,
    type RawCsvTradeRow,
    type TradeSide,
    type TradeStatus,
} from '../types/csv-import.types';

function normalizeRequiredValue(
  value: string | undefined,
): string {
  return value?.trim() ?? '';
}

function normalizeOptionalValue(
  value: string | undefined,
): string | null {
  const normalized = value?.trim() ?? '';

  return normalized.length > 0 ? normalized : null;
}

function isPositiveNumberString(value: string): boolean {
  if (value.length === 0) {
    return false;
  }

  const numberValue = Number(value);

  return (
    Number.isFinite(numberValue) &&
    numberValue > 0
  );
}

function isValidDateString(value: string): boolean {
  if (value.length === 0) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function isTradeSide(value: string): value is TradeSide {
  return TRADE_SIDES.includes(value as TradeSide);
}

function isTradeStatus(
  value: string,
): value is TradeStatus {
  return TRADE_STATUSES.includes(value as TradeStatus);
}

function createError(
  rowNumber: number,
  field: string,
  message: string,
): CsvImportRowError {
  return {
    rowNumber,
    field,
    message,
  };
}

export function validateCsvTradeRow(
  rawRow: RawCsvTradeRow,
  rowNumber: number,
): CsvImportPreviewRow {
  const symbol = normalizeRequiredValue(
    rawRow.symbol,
  ).toUpperCase();

  const sideValue = normalizeRequiredValue(
    rawRow.side,
  ).toUpperCase();

  const statusValue = normalizeRequiredValue(
    rawRow.status,
  ).toUpperCase();

  const quantity = normalizeRequiredValue(
    rawRow.quantity,
  );

  const entryPrice = normalizeRequiredValue(
    rawRow.entryPrice,
  );

  const exitPrice = normalizeOptionalValue(
    rawRow.exitPrice,
  );

  const openedAt = normalizeRequiredValue(
    rawRow.openedAt,
  );

  const closedAt = normalizeOptionalValue(
    rawRow.closedAt,
  );

  const notes = normalizeOptionalValue(rawRow.notes);

  const errors: CsvImportRowError[] = [];

  if (!symbol) {
    errors.push(
      createError(
        rowNumber,
        'symbol',
        'Symbol is required',
      ),
    );
  }

  if (!isTradeSide(sideValue)) {
    errors.push(
      createError(
        rowNumber,
        'side',
        'Side must be BUY or SELL',
      ),
    );
  }

  if (!isTradeStatus(statusValue)) {
    errors.push(
      createError(
        rowNumber,
        'status',
        'Status must be OPEN, CLOSED, or CANCELLED',
      ),
    );
  }

  if (!isPositiveNumberString(quantity)) {
    errors.push(
      createError(
        rowNumber,
        'quantity',
        'Quantity must be greater than zero',
      ),
    );
  }

  if (!isPositiveNumberString(entryPrice)) {
    errors.push(
      createError(
        rowNumber,
        'entryPrice',
        'Entry price must be greater than zero',
      ),
    );
  }

  if (
    exitPrice !== null &&
    !isPositiveNumberString(exitPrice)
  ) {
    errors.push(
      createError(
        rowNumber,
        'exitPrice',
        'Exit price must be greater than zero',
      ),
    );
  }

  if (!isValidDateString(openedAt)) {
    errors.push(
      createError(
        rowNumber,
        'openedAt',
        'Opened date must be a valid date',
      ),
    );
  }

  if (
    closedAt !== null &&
    !isValidDateString(closedAt)
  ) {
    errors.push(
      createError(
        rowNumber,
        'closedAt',
        'Closed date must be a valid date',
      ),
    );
  }

  if (statusValue === 'CLOSED' && exitPrice === null) {
    errors.push(
      createError(
        rowNumber,
        'exitPrice',
        'Exit price is required for a closed trade',
      ),
    );
  }

  if (statusValue === 'CLOSED' && closedAt === null) {
    errors.push(
      createError(
        rowNumber,
        'closedAt',
        'Closed date is required for a closed trade',
      ),
    );
  }

  if (
    isValidDateString(openedAt) &&
    closedAt !== null &&
    isValidDateString(closedAt) &&
    new Date(closedAt).getTime() <
      new Date(openedAt).getTime()
  ) {
    errors.push(
      createError(
        rowNumber,
        'closedAt',
        'Closed date cannot be earlier than opened date',
      ),
    );
  }

  const canCreateNormalizedRow =
    errors.length === 0 &&
    isTradeSide(sideValue) &&
    isTradeStatus(statusValue);

  const normalized: CsvTradeImportRow | null =
    canCreateNormalizedRow
      ? {
          rowNumber,
          symbol,
          side: sideValue,
          status: statusValue,
          quantity,
          entryPrice,
          exitPrice,
          openedAt,
          closedAt,
          notes,
        }
      : null;

  return {
    rowNumber,
    raw: rawRow,
    normalized,
    errors,
    isValid: errors.length === 0,
  };
}
