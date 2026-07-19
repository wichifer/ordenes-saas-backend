import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard }
from '../auth/guards/jwt.guard';

import { ProductsService }
from './products.service';

import { CreateProductDto }
from './dto/create-product.dto';

import { UpdateProductDto }
from './dto/update-product.dto';

@UseGuards(JwtGuard)

@Controller('products')

export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  findAll(@Req() request: any) {

    return this.productsService.findAll(
      request.user.id_empresa,
    );

  }
@Get('low-stock')
lowStock(
  @Req() request: any,
) {

  return this.productsService.lowStock(
    request.user.id_empresa,
  );

}
  @Get(':id')
  findOne(

    @Param('id') id: string,

    @Req() request: any,

  ) {

    return this.productsService.findOne(
      id,
      request.user.id_empresa,
    );

  }

  @Post()
  create(

    @Body() body: CreateProductDto,

    @Req() request: any,

  ) {

    return this.productsService.create(
      body,
      request.user,
    );

  }

  @Patch(':id')
  update(

    @Param('id') id: string,

    @Body() body: UpdateProductDto,

    @Req() request: any,

  ) {

    return this.productsService.update(
      id,
      body,
      request.user.id_empresa,
    );

  }

  @Delete(':id')
  remove(

    @Param('id') id: string,

    @Req() request: any,

  ) {

    return this.productsService.remove(
      id,
      request.user.id_empresa,
    );

  }

}