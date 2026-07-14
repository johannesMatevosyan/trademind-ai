import type { CsvImportResult } from '../types/csv-import.types';

interface CsvImportSummaryProps {
  result: CsvImportResult;
  onImportAnother: () => void;
}

export function CsvImportSummary({
  result,
  onImportAnother,
}: CsvImportSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Step 5
      </p>

      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        Import result
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryCard
          label="Imported"
          value={result.importedCount}
        />

        <SummaryCard
          label="Rejected"
          value={result.rejectedCount}
        />
      </div>

      {result.errors.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-medium text-amber-900">
            Rejected rows
          </h3>

          <div className="mt-3 space-y-2">
            {result.errors.map((error) => (
              <p
                key={`${error.rowNumber}-${error.field}-${error.message}`}
                className="text-sm text-amber-800"
              >
                Row {error.rowNumber}
                {error.field ? ` · ${error.field}` : ''}:{' '}
                {error.message}
              </p>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onImportAnother}
        className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Import another CSV
      </button>
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
}

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
