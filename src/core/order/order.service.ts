import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderInput } from 'src/core/order/dto/create.input';
import { PrismaService } from 'src/db/orm/orm.service';
import * as roundHalfEven from 'round-half-even';
import { Decimal } from '@prisma/client/runtime/library';
import StripeService from 'src/core/stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _stripeService: StripeService,
  ) {}
  async createOneByUserId(createOrderInput: CreateOrderInput, userId: number) {
    const productsId = createOrderInput.products.map((product) => product.id);

    const products = await this._prismaService.product.findMany({
      where: { id: { in: productsId } },
    });

    const productData = products.map((product) => {
      const price = new Decimal(product.price).toNumber();
      const quantity = createOrderInput.products.find((product) => product.id === product.id).quantity;

      return {
        price,
        productId: product.id,
        quantity,
        subtotal: roundHalfEven(price * quantity, 2),
      };
    });

    const total: number = productData.reduce((acc, curr) => {
      const currentProduct = createOrderInput.products.find((product) => product.id === curr.productId);
      const price = new Decimal(curr.price).toNumber();
      return roundHalfEven(acc + price * currentProduct.quantity, 2);
    }, 0);

    const order = await this._prismaService.order.create({
      data: {
        total: total,
        userId: userId,
      },
    });

    await this._prismaService.orderitem.createMany({
      data: productData.map((product) => ({
        orderId: order.id,
        price: product.price,
        productId: product.productId,
        quantity: product.quantity,
        subtotal: product.subtotal,
      })),
    });

    const updatedOrder = await this._prismaService.order.findUnique({
      where: { id: order.id },
      include: { order_items: { include: { product: true } } },
    });

    const url = await this._stripeService.createSessionUrl(total, updatedOrder.id);
    return { ...updatedOrder, orderUrl: url };
  }

  async validateOrder(payload: Buffer, signature: string) {
    const event = await this._stripeService.constructEventFromPayload(payload, signature);

    let validatedOrder = null;
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        const urlSearchParams = new URLSearchParams(checkoutSessionCompleted?.success_url?.split('?')[1]);
        const orderIdString = urlSearchParams.get('order');
        const orderId = Number(orderIdString);
        console.log('🚀 ~ file: order.service.ts:75 ~ OrderService ~ validateOrder ~ orderId:', orderId);
        if (Number.isNaN(orderId)) {
          throw new BadRequestException();
        }
        validatedOrder = await this._prismaService.order.update({
          where: { id: orderId },
          data: {
            isApproved: true,
          },
        });
        // Then define and call a function to handle the event checkout.session.completed
        break;
      default:
        throw new BadRequestException('Invalid event type');
    }

    return { order: validatedOrder };
  }

  async findManyByUserId(userId: number) {
    return await this._prismaService.order.findMany({
      where: {
        userId: userId,
        // isApproved: true,
      },
      include: {
        order_items: true,
      },
    });
  }
}
