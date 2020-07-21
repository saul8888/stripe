import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [PaymentModule,
    /*
    StripeModule.forRoot({
      apiKey: 'my_secret_key',
    })
    */
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
