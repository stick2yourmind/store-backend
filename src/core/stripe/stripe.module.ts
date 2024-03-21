import { Module } from '@nestjs/common';
import StripeService from 'src/core/stripe/stripe.service';

@Module({
  controllers: [],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
