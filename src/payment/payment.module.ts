import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeModule } from 'nestjs-stripe';
import { PaymentService } from './payment.service';
//LatestApiVersion // '2020-03-02'
@Module({
  imports: [
    StripeModule.forRoot({
      apiKey:"",
      apiVersion: '2020-03-02',
    })
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
