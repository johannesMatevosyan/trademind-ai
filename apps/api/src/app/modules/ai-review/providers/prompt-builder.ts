import { Injectable } from '@nestjs/common';

import type { AiTradeReviewInput } from './ai-provider.interface';

export interface TradeReviewPrompt {
  system: string;
  user: string;
}

@Injectable()
export class PromptBuilder {
  buildTradeReviewPrompt(
    input: AiTradeReviewInput,
  ): TradeReviewPrompt {
    return {
      system: this.buildSystemPrompt(),
      user: this.buildUserPrompt(input),
    };
  }

  private buildSystemPrompt(): string {
    return [
      'You are a professional trading coach reviewing a completed trade.',
      '',
      'Evaluate the trader objectively across:',
      '- trade execution',
      '- trading discipline',
      '- emotional control',
      '- risk management',
      '- position sizing',
      '- reward-to-risk planning',
      '- consistency between the original plan and actual execution',
      '',
      'Your feedback must be:',
      '- constructive',
      '- specific to the supplied trade',
      '- actionable',
      '- concise',
      '- based only on the supplied information',
      '',
      'Do not invent missing trade details.',
      'When information is missing, mention that limitation in the relevant summary.',
      'Do not provide guarantees about future trading performance.',
      'Do not return markdown.',
      'Do not include text outside the required structured response.',
      '',
      'Scores must be integers between 0 and 100.',
      'Recommendations should describe concrete improvements the trader can apply to future trades.',
    ].join('\n');
  }

  private buildUserPrompt(
    input: AiTradeReviewInput,
  ): string {
    return [
      'Review the following completed trade.',
      '',
      'TRADE',
      this.formatTrade(input),
      '',
      'CALCULATED METRICS',
      this.formatMetrics(input),
      '',
      'TRADER REFLECTION',
      this.formatReflection(input),
      '',
      'ATTACHMENTS',
      this.formatAttachments(input),
      '',
      'Important:',
      'Attachment URLs are provided only as contextual metadata.',
      'Do not claim that you inspected or visually analyzed the images.',
    ].join('\n');
  }

  private formatTrade(
    input: AiTradeReviewInput,
  ): string {
    const { trade } = input;

    return [
      `Symbol: ${trade.symbol}`,
      `Side: ${trade.side}`,
      `Status: ${this.formatValue(trade.status)}`,
      `Entry price: ${this.formatNumber(trade.entryPrice)}`,
      `Exit price: ${this.formatNumber(trade.exitPrice)}`,
      `Quantity: ${this.formatNumber(trade.quantity)}`,
      `Profit/Loss: ${this.formatNumber(trade.pnl)}`,
      `Stop-loss: ${this.formatNumber(trade.stopLoss)}`,
      `Take-profit: ${this.formatNumber(trade.takeProfit)}`,
      `Opened at: ${this.formatDate(trade.openedAt)}`,
      `Closed at: ${this.formatDate(trade.closedAt)}`,
    ].join('\n');
  }

  private formatMetrics(
    input: AiTradeReviewInput,
  ): string {
    return [
      `Reward/Risk ratio: ${this.formatNumber(
        input.metrics.rewardRiskRatio,
      )}`,
      `Position size: ${this.formatNumber(
        input.metrics.positionSize,
      )}`,
    ].join('\n');
  }

  private formatReflection(
    input: AiTradeReviewInput,
  ): string {
    const reflection = input.reflection;

    if (!reflection) {
      return 'No reflection was provided.';
    }

    return [
      `Notes: ${this.formatText(reflection.notes)}`,
      `Psychology: ${this.formatText(
        reflection.psychology,
      )}`,
      `Lessons learned: ${this.formatText(
        reflection.lessonsLearned,
      )}`,
    ].join('\n');
  }

  private formatAttachments(
    input: AiTradeReviewInput,
  ): string {
    if (input.attachments.length === 0) {
      return 'No attachments were provided.';
    }

    return input.attachments
      .map((attachment, index) => {
        return [
          `Attachment ${index + 1}:`,
          `- URL: ${attachment.url}`,
          `- File name: ${this.formatValue(
            attachment.fileName,
          )}`,
          `- MIME type: ${this.formatValue(
            attachment.mimeType,
          )}`,
        ].join('\n');
      })
      .join('\n');
  }

  private formatText(
    value?: string | null,
  ): string {
    const normalized = value?.trim();

    return normalized || 'Not provided';
  }

  private formatValue(
    value?: string | null,
  ): string {
    return value?.trim() || 'Not provided';
  }

  private formatNumber(
    value?: number | null,
  ): string {
    return value === null || value === undefined
      ? 'Not provided'
      : String(value);
  }

  private formatDate(
    value?: Date | null,
  ): string {
    return value
      ? value.toISOString()
      : 'Not provided';
  }
}

