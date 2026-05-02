const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const stores = await prisma.store.findMany();
  console.log('Stores:', JSON.stringify(stores, null, 2));
  const ratings = await prisma.rating.findMany();
  console.log('Ratings:', JSON.stringify(ratings, null, 2));
  await prisma.$disconnect();
}

check();
