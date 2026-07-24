import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService }
from './payments.service';

import { JwtGuard }
from '../auth/guards/jwt.guard';

import { CreatePaymentDto } from './dto/create-payment.dto';


@UseGuards(JwtGuard)

@Controller('payments')

export class PaymentsController {

  constructor(
    private readonly paymentsService:
      PaymentsService,
  ) {}

  @Get()
  findAll(
    @Req() request: any,
  ) {

    return this.paymentsService.findAll(
      request.user.id_empresa,
    );

  }
@Get('pending-orders')
findPendingOrders(
  @Req() request: any,
) {
    console.log(
    'USER PAYMENTS:',
    request.user
  );
  return this.paymentsService.findPendingOrders(
    request.user.id_empresa,
  );

}
  @Post()
  create(
    @Body() body: CreatePaymentDto, 
    @Req() request: any,
  ) {

    return this.paymentsService.create(
      body,
      request.user,
    );

  }

}