'use client';

import { useState } from 'react';

import type {
    CsvImportResult,
    CsvParseResult,
    TradingAccountOption,
} from '../types/csv-import.types';

import { useImportTrades } from '../hooks/use-import-trades';
import { parseTradesCsv } from '../utils/parse-trades-csv';
import { CsvFileDropzone } from './csv-file-dropzone';
import { CsvImportPreview } from './csv-import-preview';
import { CsvImportSummary } from './csv-import-summary';

interface CsvImportPanelProps {
  tradingAccounts: TradingAccountOption[];
  isLoadingAccounts?: boolean;
  accountsError?: string | null;
}

export function CsvImportPanel({
  tradingAccounts,
  isLoadingAccounts = false,
  accountsError = null,
}: CsvImportPanelProps) {
    const importMutation = useImportTrades();
    const [importResult, setImportResult] =
        useState<CsvImportResult | null>(null);
    const [selectedAccountId, setSelectedAccountId] =
        useState('');

    const [parseResult, setParseResult] =
        useState<CsvParseResult | null>(null);

    const [isParsing, setIsParsing] =
        useState(false);

    const [parseError, setParseError] = useState<
        string | null
    >(null);

    async function handleImport() {
        if (
            !selectedAccountId ||
            !parseResult ||
            parseResult.validRows.length === 0
        ) {
            return;
        }

        setImportResult(null);

        try {
            const result = await importMutation.mutateAsync({
            tradingAccountId: selectedAccountId,
            rows: parseResult.validRows,
            });

            setImportResult(result);
        } catch {
            // The mutation error is rendered below.
        }
    }

    async function handleFileSelected(file: File) {
        setIsParsing(true);
        setParseError(null);
        setParseResult(null);

        try {
            const result = await parseTradesCsv(file);

            setParseResult(result);
        } catch (error) {
            setParseError(
                error instanceof Error
                ? error.message
                : 'The CSV file could not be parsed',
            );
        } finally {
            setIsParsing(false);
        }
    }

    const validRowsCount =
        parseResult?.validRows.length ?? 0;

    const canContinue =
        selectedAccountId.length > 0 &&
        validRowsCount > 0 &&
        !isParsing &&
        !importMutation.isPending &&
        importResult === null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Step 1
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Select trading account
          </h2>
        </div>

        {isLoadingAccounts && (
          <p className="text-sm text-slate-500">
            Loading trading accounts…
          </p>
        )}

        {accountsError && (
          <p className="text-sm text-red-600">
            {accountsError}
          </p>
        )}

        {!isLoadingAccounts &&
          !accountsError &&
          tradingAccounts.length === 0 && (
            <p className="text-sm text-slate-500">
              No trading accounts are available.
              Create an account before importing
              trades.
            </p>
          )}

        {tradingAccounts.length > 0 && (
          <select
            value={selectedAccountId}
            onChange={(event) =>
              setSelectedAccountId(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
          >
            <option value="">
              Select a trading account
            </option>

            {tradingAccounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
              >
                {account.name}
                {account.broker
                  ? ` · ${account.broker}`
                  : ''}
                {account.currency
                  ? ` · ${account.currency}`
                  : ''}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Step 2
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Upload CSV
          </h2>
        </div>

        <CsvFileDropzone
          fileName={parseResult?.fileName}
          disabled={isParsing}
          onFileSelected={handleFileSelected}
        />

        {isParsing && (
          <p className="mt-3 text-sm text-slate-500">
            Parsing CSV…
          </p>
        )}

        {parseError && (
          <p className="mt-3 text-sm text-red-600">
            {parseError}
          </p>
        )}
      </section>

      {parseResult && (
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 3
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Preview
            </h2>
          </div>

          <CsvImportPreview result={parseResult} />
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 4
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Confirm import
            </h2>

            {importMutation.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                    {importMutation.error.message}
                    </p>
                </div>
            )}

            <p className="mt-1 text-sm text-slate-500">
              {validRowsCount > 0
                ? `${validRowsCount} valid row${
                    validRowsCount === 1
                      ? ''
                      : 's'
                  } ready to import.`
                : 'Upload a CSV containing at least one valid row.'}
            </p>
          </div>

            <button
                type="button"
                disabled={!canContinue}
                onClick={handleImport}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                {importMutation.isPending
                    ? 'Importing…'
                    : 'Import valid rows'}
            </button>

            {importResult && (
                <CsvImportSummary result={importResult} onImportAnother={() => {
                    setParseResult(null);
                    setParseError(null);
                    setImportResult(null);
                    importMutation.reset();
                }} />
            )}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          The import action will be connected in
          Checkpoint 4.
        </p>
      </section>
    </div>
  );
}
