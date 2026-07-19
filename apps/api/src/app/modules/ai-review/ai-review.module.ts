import { Module } from '@nestjs/common';
import { AiReviewController } from './ai-review.controller';
import { AiReviewService } from './ai-review.service';
import { aiProviderFactory } from './providers/ai-provider.factory';
import { MockAiProvider } from './providers/mock-ai.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { PromptBuilder } from './providers/prompt-builder';

@Module({
    controllers: [AiReviewController],
    providers: [
        AiReviewService,
        PromptBuilder,
        MockAiProvider,
        OpenAiProvider,
        aiProviderFactory,
    ],
    exports: [AiReviewService],
})
export class AiReviewModule {}
