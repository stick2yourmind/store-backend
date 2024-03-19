import { Controller, Post, Body, UseGuards, UseInterceptors, Req, RawBodyRequest, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderInput } from 'src/core/order/dto/create.input';
import { User } from '@prisma/client';
import { ReqUser } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PrismaInterceptor } from 'src/common/interceptor/prisma.interceptor';
import { Request } from 'express';
import { OrderOutputMapper } from 'src/core/order/mapper/order-mapper';

@Controller('order')
@UseInterceptors(PrismaInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOneByUserId(@ReqUser() user: User, @Body() createOrderDtoInput: CreateOrderInput) {
    const data = await this.orderService.createOneByUserId(createOrderDtoInput, user.id);

    return data;
  }

  @Post('validate')
  async webhookValidation(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['stripe-signature'];
    const data = await this.orderService.validateOrder(request.rawBody, String(signature));

    return data;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findManyByUser(@ReqUser() user: User) {
    const data = await this.orderService.findManyByUserId(user.id);

    return new OrderOutputMapper().mapEntitiesToDto(data);
  }
}
