import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import StripeService from 'src/core/stripe/stripe.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}
