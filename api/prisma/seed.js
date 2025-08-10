const { PrismaClient, UserRole } = require("@prisma/client");
const { hashPassword } = require("../src/utils/auth");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  const adminPassword = await hashPassword("Passw0rd!");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log("Seeding finished.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
