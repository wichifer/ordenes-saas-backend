import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import { CreateStockMovementDto }
from './dto/create-stock-movement.dto';

@Injectable()

export class StockMovementsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  /*
  ==================================================
  LISTAR MOVIMIENTOS
  ==================================================
  */

  async findAll(id_empresa: string) {

    return this.prisma.stock_movimientos.findMany({

      where: {

        id_empresa: BigInt(id_empresa),

      },

      include: {

        articulos: true,

      },

      orderBy: {

        id_movimiento_stock: 'desc',

      },

    });

  }

  /*
  ==================================================
  MOVIMIENTO MANUAL
  ==================================================
  */

  async createManual(
    data: CreateStockMovementDto,
    user: any,
  ) {

    /*
    BUSCAR ARTICULO
    */

    const articulo =
      await this.prisma.articulos.findFirst({

        where: {

          id_articulo:
            BigInt(data.id_articulo),

          id_empresa:
            BigInt(user.empresa),

          deleted_at: null,

        },

      });

    if (!articulo) {

      throw new NotFoundException(
        'Artículo no encontrado',
      );

    }

    /*
    STOCK ACTUAL
    */

    let nuevoStock =
      Number(articulo.stock_actual);

    /*
    ENTRADA
    */

    if (
      data.tipo_movimiento === 'ENTRADA'
    ) {

      nuevoStock +=
        Number(data.cantidad);

    }

    /*
    SALIDA
    */

    if (
      data.tipo_movimiento === 'SALIDA'
    ) {

      if (

        nuevoStock <
        Number(data.cantidad)

      ) {

        throw new BadRequestException(
          'Stock insuficiente',
        );

      }

      nuevoStock -=
        Number(data.cantidad);

    }

    /*
    TRANSACCION
    */

    await this.prisma.$transaction(

      async (tx) => {

        /*
        ACTUALIZAR STOCK
        */

        await tx.articulos.update({

          where: {
            id_articulo:
              articulo.id_articulo,
          },

          data: {
            stock_actual:
              nuevoStock,
          },

        });

        /*
        CREAR MOVIMIENTO
        */

        await tx.stock_movimientos.create({

          data: {

            id_empresa:
              BigInt(user.empresa),

            id_articulo:
              articulo.id_articulo,

            tipo_movimiento:
              data.tipo_movimiento,

            cantidad:
              Number(data.cantidad),

            referencia:
              data.referencia,

          },

        });

      },

    );

    return {

      message:
        'Movimiento registrado',

    };

  }

}