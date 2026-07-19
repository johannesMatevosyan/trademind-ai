import {
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiReviewService } from './ai-review.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class AiReviewController {
  constructor(
    private readonly aiReviewService: AiReviewService,
  ) {}

  @Post(':id/ai-review')
  generateReview(
    @Param('id') tradeId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.aiReviewService.generateReview(
      tradeId,
      request.user.userId,
    );
  }
}
