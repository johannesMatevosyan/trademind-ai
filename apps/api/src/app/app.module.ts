import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TradesModule } from './modules/trades/trades.module';
import { TradingAccountsModule } from './modules/trading-accounts/trading-accounts.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TradingAccountsModule,
    TradesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
