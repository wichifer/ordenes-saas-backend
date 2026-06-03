import { Injectable } from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class ReportsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async debtors(
    id_empresa: string,
  ) {

    const clientes =
      await this.prisma.clientes.findMany({

        where: {

          id_empresa:
            BigInt(id_empresa),

          deleted_at: null,

        },

      });

const resultado: any[] = [];

    for (const cliente of clientes) {

      const movimientos =
        await this.prisma.cliente_movimientos.findMany({

          where: {

            id_empresa:
              BigInt(id_empresa),

            id_cliente:
              cliente.id_cliente,

          },

        });

      let debe = 0;
      let pagado = 0;

      for (const mov of movimientos) {

        const monto =
          Number(mov.monto);

        switch (mov.tipo_movimiento) {

          case 'VENTA':
            debe += monto;
            break;

          case 'PAGO':
          case 'NOTA_CREDITO':
            pagado += monto;
            break;

        }

      }

      const saldo =
        debe - pagado;

      if (saldo > 0) {

        resultado.push({

          id_cliente:
            cliente.id_cliente,

          cliente:

            cliente.razon_social ||

            `${cliente.nombre} ${cliente.apellido ?? ''}`,

          saldo,

        });

      }

    }

    return resultado.sort(

      (a, b) =>

        b.saldo - a.saldo,

    );

  }
async salesByClient(
  id_empresa: string,
) {

  const clientes =
    await this.prisma.clientes.findMany({

      where: {

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

    });

  const resultado: any[] = [];

  for (const cliente of clientes) {

    const ventas =
      await this.prisma.ordenes_compra.aggregate({

        where: {

          id_empresa: BigInt(id_empresa),

          id_cliente: cliente.id_cliente,

          estado: 'APROBADA',

          deleted_at: null,

        },

        _sum: {

          total: true,

        },

      });

    const totalVentas =
      Number(
        ventas._sum.total || 0,
      );

    resultado.push({

      id_cliente:
        cliente.id_cliente,

      cliente:

        cliente.razon_social ||

        `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`
          .trim(),

      ventas:
        totalVentas,

    });

  }

  return resultado.sort(

    (a, b) =>

      b.ventas - a.ventas,

  );

}
async sales(
  id_empresa: string,
  from?: string,
  to?: string,
) {

  const where: any = {

    id_empresa:
      BigInt(id_empresa),

    estado: 'APROBADA',

    deleted_at: null,

  };

  if (from || to) {

    where.fecha = {};

    if (from) {

      where.fecha.gte =
        new Date(from);

    }

    if (to) {

      const fechaFin =
        new Date(to);

      fechaFin.setHours(
        23,
        59,
        59,
        999,
      );

      where.fecha.lte =
        fechaFin;

    }

  }

  const ordenes =
    await this.prisma.ordenes_compra.findMany({

      where,

    });

  const ventas =
    ordenes.reduce(

      (acc, orden) =>

        acc + Number(orden.total),

      0,

    );

  const clientes =
    new Set(

      ordenes.map((o) =>
        o.id_cliente.toString(),
      ),

    );

  return {

    cantidad_ordenes:
      ordenes.length,

    ventas,

    clientes:
      clientes.size,

  };

}
}