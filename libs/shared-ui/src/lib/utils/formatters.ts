const APP_LOCALE = 'en-US';
const APP_TIME_ZONE = 'UTC';

const CURRENCY_FORMATTER = new Intl.NumberFormat(APP_LOCALE, {
  style: 'currency',
  currency: 'USD',
});

const COMPACT_CURRENCY_FORMATTER = new Intl.NumberFormat(APP_LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const DATE_FORMATTER = new Intl.DateTimeFormat(APP_LOCALE, {
  timeZone: APP_TIME_ZONE,
});

export function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return CURRENCY_FORMATTER.format(value);
}

export function formatCompactCurrency(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return COMPACT_CURRENCY_FORMATTER.format(value);
}

export function formatDecimal(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return value.toFixed(2);
}

export function formatPercent(value?: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return `${value.toFixed(1)}%`;
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return DATE_FORMATTER.format(parsedDate);
}
