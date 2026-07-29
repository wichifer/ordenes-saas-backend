import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import { CreateStockMovementDto }
from './dto/create-stock-movement.dto';

import { AuditService }
from '../audit/audit.service';
@Injectable()

export class StockMovementsService {

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}
async findByProduct(idArticulo: number, id_empresa: string,) {
  return this.prisma.stock_movimientos.findMany({
    where: {
      id_articulo: idArticulo,
      id_empresa:BigInt(id_empresa),
    },
    include: {
      articulos: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 10,
  });
}
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
DETALLE MOVIMIENTO
==================================================
*/

async findOne(
  id_movimiento_stock: number,
  id_empresa: string,
) {

  const movement =
    await this.prisma.stock_movimientos.findFirst({

      where: {

        id_movimiento_stock:
          BigInt(id_movimiento_stock),

        id_empresa:
          BigInt(id_empresa),

      },

      include: {

        articulos: true,

      },

    });


  if (!movement) {

    throw new NotFoundException(
      'Movimiento no encontrado',
    );

  }


  return movement;

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
console.log("DATA:", data);
console.log("USER:", user);
    const articulo =
      await this.prisma.articulos.findFirst({

        where: {

          id_articulo:
            BigInt(data.id_articulo),

          id_empresa:
            BigInt(user.id_empresa),

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
console.log(JSON.stringify(user, null, 2));
        await tx.stock_movimientos.create({

          data: {

            id_empresa:
              BigInt(user.id_empresa),

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