import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { config as dotenvConfig } from 'dotenv';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';

dotenvConfig({ path: '.env' });
const configService = new ConfigService();

const prisma = new PrismaClient();

const imageGenerator = (num: number) => {
  const twoDigitString = num < 10 ? `0${num}` : `${num}`;
  const imageUrl = configService.getOrThrow('APP_BASE_URL') + '/img/product/' + twoDigitString + '.jpg';
  return imageUrl;
};

async function seed(): Promise<void> {
  const initialUsers: Prisma.UserCreateManyInput[] = [
    {
      email: 'admin@default.com',
      password: '$2b$10$urg/FM3vis/wZzamdoBNHe.VpI6YiRy6ed/7LUrbOg1EIXgF3iAHC',
      role: [UserRole.ADMIN],
    },
    {
      email: 'user@default.com',
      password: '$2b$10$urg/FM3vis/wZzamdoBNHe.VpI6YiRy6ed/7LUrbOg1EIXgF3iAHC',
    },
  ];
  await prisma.user.createMany({ data: initialUsers });

  const fakeProducts = Array.from({ length: 33 }, (_, i) => i).map((_, i) => ({
    name: faker.science.chemicalElement().name,
    description: faker.commerce.productDescription(),
    image: imageGenerator(i + 1),
    price:
      Number(faker.commerce.price({ min: 15, max: 300, dec: 0 })) +
      Number(faker.commerce.price({ min: 0, max: 100, dec: 0 })) / 100,
    stock: Number(faker.commerce.price({ min: 1, max: 100, dec: 0 })),
  }));

  await prisma.product.createMany({ data: fakeProducts });
}

seed()
  .then(() => {
    console.log('database populated');
  })
  .catch((err) => {
    console.log('error while trying to populate database');
    console.log('🚀 ~ err:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
