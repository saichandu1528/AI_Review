import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "owner@example.com";
  const plainPassword = "Owner@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 1. Create Owner User
  let owner = await prisma.user.findUnique({ where: { email } });
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: "Test Store Owner",
        email,
        password: hashedPassword,
        address: "456 Owner Rd",
        role: "STORE_OWNER",
      },
    });
    console.log("Owner created:", owner.email);
  } else {
    console.log("Owner already exists");
  }

  // 2. Create Store for Owner
  const store = await prisma.store.findUnique({ where: { ownerId: owner.id } });
  if (!store) {
    const newStore = await prisma.store.create({
      data: {
        name: "Emerald Coffee",
        email: "contact@emeraldcoffee.com",
        address: "789 Bean Lane, Grinders City",
        ownerId: owner.id,
      },
    });
    console.log("Store created:", newStore.name);

    // 3. Add a test rating
    // Create a normal user first
    let user = await prisma.user.findUnique({ where: { email: "user@example.com" } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Regular Joe",
                email: "user@example.com",
                password: hashedPassword,
                address: "some address",
                role: "NORMAL"
            }
        });
    }

    await prisma.rating.create({
        data: {
            value: 5,
            storeId: newStore.id,
            userId: user.id
        }
    });
    console.log("Test rating added");
  } else {
    console.log("Store already exists for this owner");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
