import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsService } from './analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository, PrismaService],
})
export class AnalyticsModule {}
