import {
    IsEnum,
    IsISO8601,
    IsNumberString,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

  import { TradeSide, TradeStatus } from '../../../../generated/prisma';

export class UpdateTradeDto {
  @IsOptional()
  @IsString()
  tradingAccountId?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9/_-]{2,20}$/, {
    message:
      'symbol must contain only uppercase letters, numbers, /, _ or -',
  })
  symbol?: string;

  @IsOptional()
  @IsEnum(TradeSide)
  side?: TradeSide;

  @IsOptional()
  @IsEnum(TradeStatus)
  status?: TradeStatus;

  @IsOptional()
  @IsNumberString()
  entryPrice?: string;

  @IsOptional()
  @IsNumberString()
  exitPrice?: string;

  @IsOptional()
  @IsNumberString()
  quantity?: string;

  @IsOptional()
  @IsNumberString()
  pnl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsISO8601()
  openedAt?: string;

  @IsOptional()
  @IsISO8601()
  closedAt?: string;
}
