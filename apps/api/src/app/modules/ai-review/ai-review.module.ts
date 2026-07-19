import { Module } from '@nestjs/common';

import { AiReviewController } from './ai-review.controller';
import { AiReviewService } from './ai-review.service';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock-ai.provider';

@Module({
  controllers: [AiReviewController],
  providers: [
    AiReviewService,
    MockAiProvider,
    {
      provide: AI_PROVIDER,
      useExisting: MockAiProvider,
    },
  ],
  exports: [AiReviewService],
})
export class AiReviewModule {}
