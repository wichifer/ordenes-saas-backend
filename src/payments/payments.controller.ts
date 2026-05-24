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
      request.user.empresa,
    );

  }

  @Post()
  create(
    @Body() body: any,
    @Req() request: any,
  ) {

    return this.paymentsService.create(
      body,
      request.user,
    );

  }

}