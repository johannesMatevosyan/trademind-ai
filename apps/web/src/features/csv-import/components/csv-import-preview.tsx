import type {
  CsvImportPreviewRow,
  CsvParseResult,
} from '../types/csv-import.types';

interface CsvImportPreviewProps {
  result: CsvParseResult;
}

function formatDateValue(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getDisplayValue(
  row: CsvImportPreviewRow,
  field:
    | 'symbol'
    | 'side'
    | 'status'
    | 'quantity'
    | 'entryPrice'
    | 'exitPrice'
    | 'openedAt'
    | 'closedAt',
): string {
  const rawValue = row.raw[field];

  if (!rawValue || rawValue.trim() === '') {
    return '—';
  }

  const normalizedValue = rawValue.trim();

  if (
    field === 'openedAt' ||
    field === 'closedAt'
  ) {
    return formatDateValue(normalizedValue);
  }

  return normalizedValue;
}

export function CsvImportPreview({
  result,
}: CsvImportPreviewProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <PreviewCountCard
          label="Total rows"
          value={result.totalRows}
        />

        <PreviewCountCard
          label="Valid rows"
          value={result.validRows.length}
        />

        <PreviewCountCard
          label="Invalid rows"
          value={result.invalidRows.length}
        />
      </div>

      {result.errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-medium text-red-900">
            CSV parsing issues
          </h3>

          <ul className="mt-2 space-y-1 text-sm text-red-700">
            {result.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {result.rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Row</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">
                    Entry price
                  </th>
                  <th className="px-4 py-3">
                    Exit price
                  </th>
                  <th className="px-4 py-3">
                    Opened
                  </th>
                  <th className="px-4 py-3">
                    Closed
                  </th>
                  <th className="px-4 py-3">
                    Validation
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {result.rows.map((row) => (
                  <tr
                    key={row.rowNumber}
                    className={
                      row.isValid
                        ? 'bg-white'
                        : 'bg-red-50/40'
                    }
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {row.rowNumber}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {getDisplayValue(
                        row,
                        'symbol',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(row, 'side')}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'status',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'quantity',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'entryPrice',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'exitPrice',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'openedAt',
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {getDisplayValue(
                        row,
                        'closedAt',
                      )}
                    </td>

                    <td className="min-w-72 px-4 py-3">
                      {row.isValid ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Valid
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {row.errors.map((error) => (
                            <p
                              key={`${error.field}-${error.message}`}
                              className="text-xs text-red-700"
                            >
                              {error.field
                                ? `${error.field}: `
                                : ''}
                              {error.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

interface PreviewCountCardProps {
  label: string;
  value: number;
}

function PreviewCountCard({
  label,
  value,
}: PreviewCountCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
