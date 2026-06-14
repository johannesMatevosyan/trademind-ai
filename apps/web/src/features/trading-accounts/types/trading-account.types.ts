export type TradingAccountStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | string;

export interface TradingAccount {
  id: string;
  name?: string | null;
  broker?: string | null;
  currency?: string | null;
  balance?: number | string | null;
  status?: TradingAccountStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
