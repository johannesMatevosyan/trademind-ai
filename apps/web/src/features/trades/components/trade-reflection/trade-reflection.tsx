'use client';

import type { TradeDetails } from '../../types/trade.types';
import { TradeLessonsLearnedCard } from './trade-lessons-learned-card';
import { TradeNotesCard } from './trade-notes-card';
import { TradePsychologyCard } from './trade-psychology-card';

interface TradeReflectionProps {
  trade: TradeDetails;
}

export function TradeReflection({
  trade,
}: TradeReflectionProps) {
  return (
    <section
      className="flex w-full flex-col gap-6"
      aria-labelledby="trade-reflection-title"
    >
      <div>
        <h2
          id="trade-reflection-title"
          className="text-xl font-semibold text-slate-900"
        >
          Trade Reflection
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review your execution, emotional state, and
          lessons from this trade.
        </p>
      </div>

      <TradeNotesCard
        tradeId={trade.id}
        initialValue={trade.notes}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <TradePsychologyCard
          tradeId={trade.id}
          initialValue={trade.psychology}
        />

        <TradeLessonsLearnedCard
          tradeId={trade.id}
          initialValue={trade.lessonsLearned}
        />
      </div>
    </section>
  );
}
