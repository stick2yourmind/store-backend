import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderOutput } from 'src/core/order/entities/order.entity';
import { EntityDtoMapper } from 'utils/mapper';

export type OrdersWithCategory = Prisma.OrderGetPayload<{
  include: { order_items: true };
}>;

export class OrderOutputMapper extends EntityDtoMapper<OrdersWithCategory, OrderOutput> {
  mapEntityToDto(order: OrdersWithCategory): OrderOutput {
    return {
      createdAt: order.createdAt.toISOString(),
      userId: order.userId,
      id: order.id,
      isApproved: order.isApproved,
      total: new Decimal(order.total).toNumber(),
      updatedAt: order.updatedAt.toISOString(),
      orderItems: order.order_items,
    };
  }
}
