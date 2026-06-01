import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Delete,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateOrderDto }from './dto/update-order.dto';
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
    @Body() body: CreateOrderDto,
    @Req() request: any,
  ) {

    return this.ordersService.create(
      body,
      request.user,
    );

  }
  
  @Delete(':id')
  remove(

    @Param('id') id: string,

    @Req() request: any,

  ) {

    return this.ordersService.remove(
      id,
      request.user.empresa,
    );

  }
  @Patch(':id')
update(

  @Param('id') id: string,

  @Body() body: UpdateOrderDto,

  @Req() request: any,

) {

  return this.ordersService.update(
    id,
    body,
    request.user.empresa,
  );

}
}
