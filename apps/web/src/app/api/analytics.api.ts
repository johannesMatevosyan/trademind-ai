import { apiFetch } from '@/shared/api/api-client';
import { AnalyticsOverview } from '../../types/analytics.types';

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {

    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/overview`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch analytics overview');
    }

    return response.json();
}
