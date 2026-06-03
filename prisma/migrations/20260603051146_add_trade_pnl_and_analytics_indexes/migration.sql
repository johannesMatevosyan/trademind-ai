-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "pnl" DECIMAL(18,8);

-- CreateIndex
CREATE INDEX "Trade_closedAt_idx" ON "Trade"("closedAt");

-- CreateIndex
CREATE INDEX "Trade_userId_tradingAccountId_idx" ON "Trade"("userId", "tradingAccountId");

-- CreateIndex
CREATE INDEX "Trade_userId_symbolId_idx" ON "Trade"("userId", "symbolId");

-- CreateIndex
CREATE INDEX "Trade_userId_status_idx" ON "Trade"("userId", "status");

-- CreateIndex
CREATE INDEX "Trade_userId_openedAt_idx" ON "Trade"("userId", "openedAt");

-- CreateIndex
CREATE INDEX "Trade_userId_closedAt_idx" ON "Trade"("userId", "closedAt");
