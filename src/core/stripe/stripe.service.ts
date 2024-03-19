import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as roundHalfEven from 'round-half-even';

@Injectable()
export default class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly _configService: ConfigService) {
    const STRIPE_SECRET_KEY = this._configService.getOrThrow('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  async constructEventFromPayload(payload: Buffer, signature: string) {
    const WEBHOOK_SECRET_KEY = this._configService.getOrThrow('STRIPE_WEBHOOK_SECRET_KEY');

    return this.stripe.webhooks.constructEvent(payload, signature, WEBHOOK_SECRET_KEY);
  }

  async createSessionUrl(total: number, orderId: number) {
    const frontendBaseUrl = this._configService.getOrThrow('FRONT_APP_BASE_URL');
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Edge store',
              description: `ORDER Nº: ${orderId}`,
            },
            // 100 = 1 dollar
            unit_amount: roundHalfEven(total * 100, 2),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendBaseUrl}/payment?order=${orderId}`,
      cancel_url: `${frontendBaseUrl}/checkout?order=${orderId}`,
    });

    return session.url;
  }
}
