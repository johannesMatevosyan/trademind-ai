import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTradeReflectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5_000)
  psychology?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5_000)
  lessonsLearned?: string;
}
