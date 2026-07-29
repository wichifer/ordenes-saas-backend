import {
  Body,
  Controller,
  Get,
  Param,
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
@Get("product/:idArticulo")
findByProduct(
  @Param("idArticulo") idArticulo: string,
  @Req() req,
) {
  return this.stockMovementsService.findByProduct(
    Number(idArticulo),
    req.user.id_empresa,
  );
}
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
      request.user.id_empresa,
    );

  }

  /*
==================================================
DETALLE MOVIMIENTO
==================================================
*/

@Get(':id')
findOne(
  @Param('id') id: string,
  @Req() request: any,
) {

  return this.stockMovementsService.findOne(
    Number(id),
    request.user.id_empresa,
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