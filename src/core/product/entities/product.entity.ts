import { Category } from '@prisma/client';

export class ProducOutput {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  category: Category[];
}
