import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';

import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)

@Controller('orders')

export class OrdersController {

  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  findAll(@Req() request: any) {

    return this.ordersService.findAll(
      request.user.empresa,
    );

  }
  @Get(':id')
  findOne(
  @Param('id') id: string,
  @Req() request: any,
) {

  return this.ordersService.findOne(
    id,
    request.user.empresa,
  );

}

  @Post()
  create(
    @Body() body: any,
    @Req() request: any,
  ) {

    return this.ordersService.create(
      body,
      request.user,
    );

  }

}
