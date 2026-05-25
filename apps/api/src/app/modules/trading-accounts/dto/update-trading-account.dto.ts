import { PartialType } from '@nestjs/mapped-types';
import { CreateTradingAccountDto } from './create-trading-account.dto';

export class UpdateTradingAccountDto extends PartialType(CreateTradingAccountDto) {}
