import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // delete all sessions
  await prisma.session.deleteMany().catch(() => 'no sessions');

  // delete all users
  await prisma.user.deleteMany().catch(() => 'no users');

  // create admin
  await prisma.user.create({
    data: { name: 'admin', roleId: 0, image: faker.image.avatar(), email: faker.internet.email() },
  });

  // generate array of users
  const users = new Array(100).fill(0).map(() => {
    const name = [faker.name.firstName(), faker.name.lastName()].join(' ');
    return {
      name,
      email: name.toLowerCase().replace(/ /g, '.') + '@wrkplay.app',
      image: faker.image.avatar(),
      roleId: 1,
    };
  });

  // create users
  await prisma.user.createMany({ data: users });

  console.log(`Database has been seeded.`);
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
