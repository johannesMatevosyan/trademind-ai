import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import type { AiReviewResponse } from '../types/ai-review-response.type';
import type { AiReviewResult } from '../types/ai-review-result.type';
import type {
  AiProvider,
  AiTradeReviewInput,
} from './ai-provider.interface';
import { PromptBuilder } from './prompt-builder';

const TRADE_REVIEW_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'overallScore',
    'execution',
    'riskManagement',
    'psychology',
    'strengths',
    'mistakes',
    'recommendations',
    'confidence',
  ],
  properties: {
    overallScore: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
    },
    execution: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'summary'],
      properties: {
        score: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
        },
        summary: {
          type: 'string',
        },
      },
    },
    riskManagement: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'summary'],
      properties: {
        score: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
        },
        summary: {
          type: 'string',
        },
      },
    },
    psychology: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'summary'],
      properties: {
        score: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
        },
        summary: {
          type: 'string',
        },
      },
    },
    strengths: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    mistakes: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    recommendations: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    confidence: {
      type: 'string',
      enum: ['LOW', 'MEDIUM', 'HIGH'],
    },
  },
} as const;

@Injectable()
export class OpenAiProvider implements AiProvider {
  private readonly logger = new Logger(
    OpenAiProvider.name,
  );

  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promptBuilder: PromptBuilder,
  ) {
    this.model =
      this.configService.get<string>('OPENAI_MODEL') ??
      'gpt-5-mini';
  }

  async generateTradeReview(
    input: AiTradeReviewInput,
  ): Promise<AiReviewResult> {
    const client = this.createClient();

    const prompt =
      this.promptBuilder.buildTradeReviewPrompt(input);

    try {
      const response = await client.responses.create({
        model: this.model,
        instructions: prompt.system,
        input: prompt.user,
        text: {
          format: {
            type: 'json_schema',
            name: 'trade_review',
            strict: true,
            schema: TRADE_REVIEW_JSON_SCHEMA,
          },
        },
      });

      if (!response.output_text) {
        throw new Error(
          'OpenAI returned an empty response.',
        );
      }

      const review = JSON.parse(
        response.output_text,
      ) as AiReviewResponse;

      return {
        provider: 'openai',
        model: this.model,
        review,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Failed to generate an AI trade review.',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      throw new ServiceUnavailableException(
        'The AI review service is temporarily unavailable.',
      );
    }
  }

  private createClient(): OpenAI {
    const apiKey =
      this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey?.trim()) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is not configured.',
      );
    }

    return new OpenAI({
      apiKey,
    });
  }
}
