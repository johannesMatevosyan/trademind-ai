import {
    Inject,
    Injectable,
} from '@nestjs/common';

import {
    AI_PROVIDER,
    type AiProvider,
    type AiTradeReviewInput,
} from './providers/ai-provider.interface';
import type { AiReviewResult } from './types/ai-review-result.type';

@Injectable()
export class AiReviewService {
  constructor(
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AiProvider,
  ) {}

  generateReview(
    input: AiTradeReviewInput,
  ): Promise<AiReviewResult> {
    return this.aiProvider.generateTradeReview(input);
  }
}
