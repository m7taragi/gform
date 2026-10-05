const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.masterData.createMany({
    data: [
      { name: 'Districts', data: JSON.stringify(['District A', 'District B', 'District C']) },
      { name: 'Police Ranks', data: JSON.stringify(['Constable', 'Head Constable', 'Sub-Inspector', 'Inspector', 'DSP']) }
    ]
  });
  console.log('Seeded Master Data');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
