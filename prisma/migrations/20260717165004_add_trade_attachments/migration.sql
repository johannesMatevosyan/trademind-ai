-- CreateTable
CREATE TABLE "TradeAttachment" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradeAttachment_storageKey_key" ON "TradeAttachment"("storageKey");

-- CreateIndex
CREATE INDEX "TradeAttachment_tradeId_idx" ON "TradeAttachment"("tradeId");

-- AddForeignKey
ALTER TABLE "TradeAttachment" ADD CONSTRAINT "TradeAttachment_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
