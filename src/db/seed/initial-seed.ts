import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { config as dotenvConfig } from 'dotenv';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { randomIntFromInterval } from 'src/utils/random';

dotenvConfig({ path: '.env' });
const configService = new ConfigService();

const prisma = new PrismaClient();

const imageGenerator = (num: number) => {
  const twoDigitString = num < 10 ? `0${num}` : `${num}`;
  const imageUrl = configService.getOrThrow('APP_BASE_URL') + '/img/product/' + twoDigitString + '.jpg';
  return imageUrl;
};

async function seed(): Promise<void> {
  // pass 123456
  const initialUsers: Prisma.UserCreateManyInput[] = [
    {
      email: 'admin@default.com',
      password: '$2b$10$239VHgLLtRCr2yvzScx/ZeA4T9cvoEclV013E4WP9F9fvKDh611xC',
      role: [UserRole.ADMIN],
    },
    {
      email: 'user@default.com',
      password: '$2b$10$239VHgLLtRCr2yvzScx/ZeA4T9cvoEclV013E4WP9F9fvKDh611xC',
    },
  ];
  await prisma.user.createMany({ data: initialUsers });

  const categories = faker.helpers.uniqueArray(faker.science.unit, 3);

  // Insert categories into database
  const fakeCategories: Prisma.CategoryCreateManyInput[] = Array.from({ length: 3 }, (_, i) => i).map(
    (_, i) => ({
      name: categories[i].name,
      description: faker.commerce.productDescription(),
    }),
  );
  await prisma.category.createMany({ data: fakeCategories });

  const products = faker.helpers.uniqueArray(faker.science.chemicalElement, 33);
  const fakeProducts = Array.from({ length: 33 }, (_, i) => i).map((_, i) => ({
    name: products[i].name,
    description: faker.commerce.productDescription(),
    image: imageGenerator(i + 1),
    price:
      Number(faker.commerce.price({ min: 15, max: 300, dec: 0 })) +
      Number(faker.commerce.price({ min: 0, max: 100, dec: 0 })) / 100,
    stock: Number(faker.commerce.price({ min: 1, max: 100, dec: 0 })),
  }));

  for (const product of fakeProducts) {
    const category = randomIntFromInterval(1, categories.length);
    await prisma.product.create({
      data: {
        ...product,
        category: { connect: [{ id: category }] },
      },
    });
  }
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
