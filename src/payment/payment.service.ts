import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    public constructor(
        @InjectStripe()
        private readonly stripeClient: Stripe
    ) { }

    async newCustomer(
        body: any,
    ): Promise<Stripe.Customer> {
        const customer = await this.stripeClient.customers.create({
            email: body.email,
        });
        console.log(customer)
        return customer
    }

    async subcription(
        body: any,
    ): Promise<Stripe.Subscription> {
        // Attach the payment method to the customer
        try {
            await this.stripeClient.paymentMethods.attach(body.paymentMethodId, {
                customer: body.customerId,
            });
        } catch (error) {
            //return res.status('402').send({ error: { message: error.message } });
            console.log(error)
            //throw new InternalServerErrorException();
            return error
        }

        // Change the default invoice settings on the customer to the new payment method
        await this.stripeClient.customers.update(
            body.customerId,{
                invoice_settings: {
                    default_payment_method: body.paymentMethodId,
                },
            }
        );

        // Create the subscription
        const subscription = await this.stripeClient.subscriptions.create({
            customer: body.customerId,
            items: [{ price: 'price_HGd7M3DV3IMXkC' }],
            expand: ['latest_invoice.payment_intent'],
        });
        console.log(subscription)
        return subscription
    }

}


/*
app.post('/create-subscription', async (req, res) => {
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: 'price_HGd7M3DV3IMXkC' }],
    expand: ['latest_invoice.payment_intent'],
  });

  res.send(subscription);
});
*/
