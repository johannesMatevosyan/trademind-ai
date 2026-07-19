import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AiReviewModule } from './modules/ai-review/ai-review.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { TradesModule } from './modules/trades/trades.module';
import { TradingAccountsModule } from './modules/trading-accounts/trading-accounts.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TradingAccountsModule,
    TradesModule,
    AnalyticsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
