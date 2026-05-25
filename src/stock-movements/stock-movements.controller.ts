import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { StockMovementsService }
from './stock-movements.service';

import { JwtGuard }
from '../auth/guards/jwt.guard';

import { CreateStockMovementDto }
from './dto/create-stock-movement.dto';

@UseGuards(JwtGuard)

@Controller('stock-movements')

export class StockMovementsController {

  constructor(
    private readonly stockMovementsService:
      StockMovementsService,
  ) {}

  /*
  ==================================================
  LISTAR MOVIMIENTOS
  ==================================================
  */

  @Get()
  findAll(
    @Req() request: any,
  ) {

    return this.stockMovementsService.findAll(
      request.user.empresa,
    );

  }

  /*
  ==================================================
  MOVIMIENTO MANUAL
  ==================================================
  */

  @Post('manual')
  createManual(
    @Body() body: CreateStockMovementDto,
    @Req() request: any,
  ) {

    return this.stockMovementsService.createManual(
      body,
      request.user,
    );

  }

}