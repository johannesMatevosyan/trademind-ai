import { apiFetch } from '@/shared/api/api-client';

import type {
    CsvImportRequest,
    CsvImportResult,
} from '../types/csv-import.types';

export async function importTrades(
  payload: CsvImportRequest,
): Promise<CsvImportResult> {
  const response = await apiFetch('/trades/import', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Trade import failed';

    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
      };

      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(', ');
      } else if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep the fallback message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<CsvImportResult>;
}
