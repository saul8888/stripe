import { Controller, Post, Body, Get, Render } from '@nestjs/common';
import { PaymentService } from './payment.service';


@Controller('payment')
export class PaymentController {

    constructor(
        private paymentService: PaymentService
    ){}


    @Get()
    @Render('signup')
    root() {
        return { message: 'Hello saul!' };
    }


    @Post('/create-customer')
    newCustomer(
        @Body() status: any,
    ){
        return this.paymentService.newCustomer(status)  
    }

    @Get('/checkout')
    @Render('checkout.html')
    check() {
        return { message: 'Hello saul!' };
    }


}
