import { Injectable } from '@nestjs/common';

import type { AiReviewResult } from '../types/ai-review-result.type';
import type {
    AiProvider,
    AiTradeReviewInput,
} from './ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
    async generateTradeReview(
        input: AiTradeReviewInput,
    ): Promise<AiReviewResult> {
        const hasReflection = Boolean(
        input.reflection?.notes?.trim() ||
            input.reflection?.psychology?.trim() ||
            input.reflection?.lessonsLearned?.trim(),
        );

        const hasAttachments = input.attachments.length > 0;

        return {
            provider: 'mock',
            model: 'mock-trade-review-v1',
            review: {
                overallScore: 82,

                execution: {
                score: 86,
                summary:
                    'The trade had a defined entry and exit, but the exit strategy could be documented more precisely.',
                },

                riskManagement: {
                    score: 76,
                    summary:
                        'Risk appears controlled, although the position size and planned reward-to-risk ratio need clearer justification.',
                },

                psychology: {
                    score: hasReflection ? 84 : 68,
                    summary: hasReflection
                        ? 'The reflection shows useful awareness of the decisions and emotions that influenced the trade.'
                        : 'There is not enough reflection data to evaluate emotional control and discipline confidently.',
                },

                strengths: [
                    'The trade contains enough execution data for a meaningful review.',
                    hasReflection
                        ? 'Post-trade observations were documented.'
                        : 'The core trade information was recorded.',
                    hasAttachments
                        ? 'Supporting attachments were added for later visual review.'
                        : 'The trade can still be reviewed using its structured data.',
                ],

                mistakes: [
                    'The reasoning behind the position size is not sufficiently documented.',
                    'The exit decision should be compared more clearly with the original trade plan.',
                ],

                recommendations: [
                    'Record the planned stop-loss and profit target before entering the trade.',
                    'Document the maximum account risk allocated to each position.',
                    'Compare the planned exit with the actual exit during every post-trade review.',
                ],

                confidence:
                hasReflection && hasAttachments ? 'HIGH' : 'MEDIUM',
            },
        };
    }
}
