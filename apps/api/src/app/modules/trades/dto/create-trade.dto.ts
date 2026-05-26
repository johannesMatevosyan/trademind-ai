import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { TradeSide, TradeStatus } from '../../../../generated/prisma';

export class CreateTradeDto {
  @IsString()
  @IsNotEmpty()
  tradingAccountId!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9/_-]{2,20}$/, {
    message:
      'symbol must contain only uppercase letters, numbers, /, _ or -',
  })
  symbol!: string;

  @IsEnum(TradeSide)
  side!: TradeSide;

  @IsOptional()
  @IsEnum(TradeStatus)
  status?: TradeStatus;

  @IsNumberString()
  entryPrice!: string;

  @IsOptional()
  @IsNumberString()
  exitPrice?: string;

  @IsNumberString()
  quantity!: string;

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
