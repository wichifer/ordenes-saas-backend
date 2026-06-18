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
  from?: string,
  to?: string,
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

    const whereOrden: any = {

      id_empresa:
        BigInt(id_empresa),

      id_cliente:
        cliente.id_cliente,

      estado: {
        in: ['APROBADA', 'PAGADA'],
      },

      deleted_at: null,

    };

    if (from || to) {

      whereOrden.fecha = {};

      if (from) {

        whereOrden.fecha.gte =
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

        whereOrden.fecha.lte =
          fechaFin;

      }

    }

    const ventas =
      await this.prisma.ordenes_compra.aggregate({

        where: whereOrden,

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

  return resultado

    .filter(
      (c) => c.ventas > 0,
    )

    .sort(

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
  id_empresa: BigInt(id_empresa),
  estado: {
    in: ['APROBADA', 'PAGADA'],
  },
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
//
console.log('FROM:', from);
console.log('TO:', to);

console.log('WHERE:', where);
//

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
async topProducts(
  id_empresa: string,
  from?: string,
  to?: string,
) {

  const whereOrden: any = {

    id_empresa:
      BigInt(id_empresa),

      estado: {
       in: ['APROBADA', 'PAGADA'],
      },

    deleted_at: null,

  };

if (from || to) {

  whereOrden.fecha = {};

  if (
    from &&
    !isNaN(new Date(from).getTime())
  ) {

    whereOrden.fecha.gte =
      new Date(from);

  }

  if (
    to &&
    !isNaN(new Date(to).getTime())
  ) {

    const fechaFin =
      new Date(to);

    fechaFin.setHours(
      23,
      59,
      59,
      999,
    );

    whereOrden.fecha.lte =
      fechaFin;

  }

}

const detalles =
  await this.prisma.detalle_orden_compra.findMany({

    where: {

      ordenes_compra: {

        is: whereOrden,

      },

    },

  });

  const productos: Record<
    string,
    {
      descripcion_articulo: string;
      cantidad_vendida: number;
    }
  > = {};

  for (const item of detalles) {

    const key =
      item.id_articulo.toString();

    if (!productos[key]) {

      productos[key] = {

        descripcion_articulo:
          item.descripcion_articulo,

        cantidad_vendida: 0,

      };

    }

    productos[key].cantidad_vendida +=
      Number(item.cantidad);

  }

  return Object.values(productos)

    .sort(

      (a, b) =>

        b.cantidad_vendida -
        a.cantidad_vendida,

    );

}
}