import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsInt,
    IsISO8601,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    Min,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { TradeSide, TradeStatus } from '../../../../generated/prisma';

const POSITIVE_NUMBER_STRING_PATTERN =
  /^(?:0*[1-9]\d*(?:\.\d+)?|0*\.\d*[1-9]\d*)$/;

export class ImportTradeRowDto {
  @IsInt()
  @Min(2)
  rowNumber!: number;
  @IsString()
  symbol!: string;

  @IsEnum(TradeSide)
  side!: TradeSide;

  @IsEnum(TradeStatus)
  status!: TradeStatus;

  @Matches(POSITIVE_NUMBER_STRING_PATTERN, {
    message: 'quantity must be a positive number string',
  })
  quantity!: string;

  @Matches(POSITIVE_NUMBER_STRING_PATTERN, {
    message: 'entryPrice must be a positive number string',
  })
  entryPrice!: string;

  @ValidateIf(
  (_object, value) =>
        value !== null &&
        value !== undefined &&
        value !== '',
  )
  @Matches(POSITIVE_NUMBER_STRING_PATTERN, {
    message: 'exitPrice must be a positive number string',
  })
  exitPrice?: string | null;

  @IsISO8601()
  openedAt!: string;

  @ValidateIf(
  (_object, value) =>
    value !== null &&
    value !== undefined &&
    value !== '',
  )
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

