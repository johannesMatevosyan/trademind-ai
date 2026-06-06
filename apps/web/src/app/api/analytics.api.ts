import { AnalyticsOverview } from '../../types/analytics.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAnalyticsOverview(
  accessToken: string
): Promise<AnalyticsOverview> {
  const response = await fetch(
    `${API_URL}/analytics/overview`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch analytics overview');
  }

  return response.json();
}
