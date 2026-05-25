import { Module } from '@nestjs/common';
import { TradingAccountsController } from './trading-accounts.controller';
import { TradingAccountsRepository } from './trading-accounts.repository';
import { TradingAccountsService } from './trading-accounts.service';

@Module({
  controllers: [TradingAccountsController],
  providers: [TradingAccountsService, TradingAccountsRepository],
})
export class TradingAccountsModule {}
