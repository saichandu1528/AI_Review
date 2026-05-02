const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const plainPassword = "Admin@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user with email ${email} already exists.`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator",
      email,
      password: hashedPassword,
      address: "123 Admin Street, Tech City",
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
