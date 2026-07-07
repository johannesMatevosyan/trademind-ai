import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../../common/types/auth-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('overview')
    getOverview(
        @CurrentUser() user: AuthUser,
        @Query() query: AnalyticsQueryDto
    ) {
        return this.analyticsService.getOverview(user.id, query);
    }

    @Get('pnl')
    getPnl(@CurrentUser() user: AuthUser, @Query() query: AnalyticsQueryDto) {
        return this.analyticsService.getPnl(user.id, query);
    }

    @Get('symbols')
    getSymbols(
        @CurrentUser() user: AuthUser,
        @Query() query: AnalyticsQueryDto
    ) {
        return this.analyticsService.getSymbols(user.id, query);
    }

    @Get('activity')
    getActivity(
        @CurrentUser() user: AuthUser,
        @Query() query: AnalyticsQueryDto
    ) {
        return this.analyticsService.getActivity(user.id, query);
    }

    @Get('pnl-history')
    getPnlHistory(@CurrentUser() user: AuthUser) {
        return this.analyticsService.getPnlHistory(user.id);
    }

    @Get('symbol-performance')
    getSymbolPerformance(@CurrentUser() user: AuthUser) {
        return this.analyticsService.getSymbolPerformance(user.id);
    }

    @Get('win-loss')
    getWinLoss(@CurrentUser() user: AuthUser) {
        return this.analyticsService.getWinLoss(user.id);
    }

    @Get('trading-activity')
    getTradingActivity(@CurrentUser() user: AuthUser) {
        return this.analyticsService.getTradingActivity(user.id);
    }

    @Get('risk-metrics')
    getRiskMetrics(@CurrentUser() user: AuthUser) {
        return this.analyticsService.getRiskMetrics(user.id);
    }
}
