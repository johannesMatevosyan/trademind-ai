export default async function TradeDetailsPage({
  params,
}: {
  params: Promise<{ tradeId: string }>;
}) {
  const { tradeId } = await params;

  return <div>Trade ID: {tradeId}</div>;
}
