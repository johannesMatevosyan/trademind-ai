import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TradeStatus } from '../../../../generated/prisma/client';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  tradingAccountId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value
  )
  symbol?: string;

  @IsOptional()
  @IsEnum(TradeStatus)
  status?: TradeStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
