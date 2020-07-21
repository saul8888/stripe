import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    public constructor(
        @InjectStripe()
        private readonly stripeClient: Stripe
    ) {}

    async newCustomer(
        body: any,
    ):Promise<Stripe.Customer>{
        const customer = await this.stripeClient.customers.create({
            email: body.email,
        });
        console.log(customer)
        return customer
    }
}
