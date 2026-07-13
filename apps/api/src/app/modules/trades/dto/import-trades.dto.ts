import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsISO8601,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { TradeSide, TradeStatus } from '../../../../generated/prisma';

export class ImportTradeRowDto {
  @IsString()
  symbol!: string;

  @IsEnum(TradeSide)
  side!: TradeSide;

  @IsEnum(TradeStatus)
  status!: TradeStatus;

  @Matches(/^\d+(\.\d+)?$/)
  quantity!: string;

  @Matches(/^\d+(\.\d+)?$/)
  entryPrice!: string;

  @IsOptional()
  @Matches(/^\d+(\.\d+)?$/)
  exitPrice?: string | null;

  @IsISO8601()
  openedAt!: string;

  @IsOptional()
  @IsISO8601()
  closedAt?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class ImportTradesDto {
  @IsUUID()
  tradingAccountId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => ImportTradeRowDto)
  rows!: ImportTradeRowDto[];
}

