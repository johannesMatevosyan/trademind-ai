import Papa from 'papaparse';

import {
    TRADE_CSV_HEADERS,
    type CsvParseResult,
    type RawCsvTradeRow,
} from '../types/csv-import.types';

import { validateCsvTradeRow } from './validate-csv-trade-row';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_IMPORT_ROWS = 500;

function normalizeHeader(header: string): string {
  return header.trim();
}

function isBlankRow(row: RawCsvTradeRow): boolean {
  return Object.values(row).every((value) => {
    return value === undefined || value.trim() === '';
  });
}

function validateHeaders(
  receivedHeaders: string[],
): string[] {
  const normalizedHeaders =
    receivedHeaders.map(normalizeHeader);

  const expectedHeaders = [...TRADE_CSV_HEADERS];

  const missingHeaders = expectedHeaders.filter(
    (header) => !normalizedHeaders.includes(header),
  );

  const unexpectedHeaders = normalizedHeaders.filter(
    (header) =>
      !expectedHeaders.includes(
        header as (typeof TRADE_CSV_HEADERS)[number],
      ),
  );

  const errors: string[] = [];

  if (missingHeaders.length > 0) {
    errors.push(
      `Missing headers: ${missingHeaders.join(', ')}`,
    );
  }

  if (unexpectedHeaders.length > 0) {
    errors.push(
      `Unexpected headers: ${unexpectedHeaders.join(', ')}`,
    );
  }

  if (
    normalizedHeaders.length !== expectedHeaders.length
  ) {
    errors.push(
      `Expected exactly ${expectedHeaders.length} CSV headers`,
    );
  }

  return errors;
}

function createEmptyResult(
  fileName: string,
  errors: string[],
): CsvParseResult {
  return {
    fileName,
    totalRows: 0,
    validRows: [],
    invalidRows: [],
    rows: [],
    errors,
  };
}

export async function parseTradesCsv(
  file: File,
): Promise<CsvParseResult> {
  if (file.size === 0) {
    return createEmptyResult(file.name, [
      'The selected CSV file is empty',
    ]);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return createEmptyResult(file.name, [
      'The CSV file must not exceed 2 MB',
    ]);
  }

  return new Promise((resolve) => {
    Papa.parse<RawCsvTradeRow>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: normalizeHeader,

      complete: (result) => {
        const parserErrors = result.errors.map(
          (error) => {
            const rowText =
              typeof error.row === 'number'
                ? ` at row ${error.row + 1}`
                : '';

            return `${error.message}${rowText}`;
          },
        );

        const fields = result.meta.fields ?? [];
        const headerErrors = validateHeaders(fields);

        if (headerErrors.length > 0) {
          resolve(
            createEmptyResult(file.name, [
              ...headerErrors,
              ...parserErrors,
            ]),
          );

          return;
        }

        const nonBlankRows = result.data.filter(
          (row) => !isBlankRow(row),
        );

        if (nonBlankRows.length === 0) {
          resolve(
            createEmptyResult(file.name, [
              'The CSV file does not contain any trade rows',
              ...parserErrors,
            ]),
          );

          return;
        }

        if (nonBlankRows.length > MAX_IMPORT_ROWS) {
          resolve(
            createEmptyResult(file.name, [
              `The CSV file contains ${nonBlankRows.length} rows. The maximum is ${MAX_IMPORT_ROWS}.`,
              ...parserErrors,
            ]),
          );

          return;
        }

        const rows = nonBlankRows.map(
          (row, index) => {
            // CSV row 1 contains headers, so the first data row is row 2.
            const rowNumber = index + 2;

            return validateCsvTradeRow(
              row,
              rowNumber,
            );
          },
        );

        const validRows = rows.flatMap((row) =>
          row.normalized ? [row.normalized] : [],
        );

        const invalidRows = rows.filter(
          (row) => !row.isValid,
        );

        resolve({
          fileName: file.name,
          totalRows: rows.length,
          validRows,
          invalidRows,
          rows,
          errors: parserErrors,
        });
      },

      error: (error) => {
        resolve(
          createEmptyResult(file.name, [
            error.message ||
              'The CSV file could not be parsed',
          ]),
        );
      },
    });
  });
}
