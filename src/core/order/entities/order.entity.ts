import { Orderitem } from '@prisma/client';

export class OrderOutput {
  id: number;
  total: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  orderItems: Orderitem[];
}
