'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverview } from '../app/api/analytics.api';

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: getAnalyticsOverview,
    retry: false,
  });
}
