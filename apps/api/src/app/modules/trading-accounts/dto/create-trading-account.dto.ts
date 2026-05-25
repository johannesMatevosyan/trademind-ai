import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTradingAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  broker!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  currency!: string;
}
