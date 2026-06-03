import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../apps/api/src/generated/prisma';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  await prisma.symbol.createMany({
    data: [
      {
        code: 'AAPL',
        name: 'Apple Inc.',
        assetClass: 'STOCK',
        exchange: 'NASDAQ',
      },
      {
        code: 'TSLA',
        name: 'Tesla Inc.',
        assetClass: 'STOCK',
        exchange: 'NASDAQ',
      },
      {
        code: 'EURUSD',
        name: 'Euro vs US Dollar',
        assetClass: 'FOREX',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed');
}

console.time('Seeding Time');

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    console.timeEnd('Seeding Time');
    await prisma.$disconnect();
  });
