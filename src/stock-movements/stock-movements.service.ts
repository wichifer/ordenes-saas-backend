import { Injectable } from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class StockMovementsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: {

    id_empresa: bigint;

    id_articulo: bigint;

    tipo_movimiento: string;

    cantidad: number;

    referencia?: string;

  }) {

    return this.prisma.stock_movimientos.create({

      data: {

        id_empresa: data.id_empresa,

        id_articulo: data.id_articulo,

        tipo_movimiento:
          data.tipo_movimiento,

        cantidad: data.cantidad,

        referencia: data.referencia,

      },

    });

  }

}