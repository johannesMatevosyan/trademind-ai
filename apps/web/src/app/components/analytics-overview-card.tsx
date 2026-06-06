interface AnalyticsOverviewCardProps {
  title: string;
  value: string | number;
}

export function AnalyticsOverviewCard({
  title,
  value,
}: AnalyticsOverviewCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
