import { Injectable } from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class DashboardService {

  constructor(
    private prisma: PrismaService,
  ) {}

  /*
  ==================================================
  KPIs
  ==================================================
  */

  async getKpis(
    id_empresa: string,
  ) {

    /*
    CLIENTES
    */

    const clientes =
      await this.prisma.clientes.count({

        where: {

          id_empresa:
            BigInt(id_empresa),

          deleted_at: null,

        },

      });

    /*
    ARTICULOS
    */

    const articulos =
      await this.prisma.articulos.count({

        where: {

          id_empresa:
            BigInt(id_empresa),

          deleted_at: null,

        },

      });

    /*
    STOCK BAJO
    */

    const articulosStock =
      await this.prisma.articulos.findMany({

        where: {

          id_empresa:
            BigInt(id_empresa),

          deleted_at: null,

        },

      });

    const stock_bajo =
      articulosStock.filter(

        (a) =>

          Number(a.stock_actual) <=
          Number(a.stock_minimo),

      ).length;

    /*
    ORDENES
    */

    const ordenes =
      await this.prisma.ordenes_compra.count({

        where: {

          id_empresa:
            BigInt(id_empresa),

          deleted_at: null,

        },

      });

    /*
    ORDENES APROBADAS
    */

    const ordenes_aprobadas =
      await this.prisma.ordenes_compra.count({

        where: {

          id_empresa:
            BigInt(id_empresa),

          estado: 'APROBADA',

          deleted_at: null,

        },

      });

    /*
    VENTAS
    */

    const ventas =
      await this.prisma.ordenes_compra.aggregate({

        where: {

          id_empresa:
            BigInt(id_empresa),

          estado: 'APROBADA',

          deleted_at: null,

        },

        _sum: {

          total: true,

        },

      });

    return {

      clientes,

      articulos,

      stock_bajo,

      ordenes,

      ordenes_aprobadas,

      ventas_totales:
        ventas._sum.total || 0,

    };

  }

  /*
  ==================================================
  ORDENES RECIENTES
  ==================================================
  */

  async recentOrders(
    id_empresa: string,
  ) {

    return this.prisma.ordenes_compra.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

      include: {

        clientes: {

          select: {

            nombre: true,
            apellido: true,
            razon_social: true,

          },

        },

      },

      orderBy: {

        fecha: 'desc',

      },

      take: 10,

    });

  }

  /*
  ==================================================
  VENTAS POR MES
  ==================================================
  */

  async salesByMonth(
    id_empresa: string,
  ) {

    const ordenes =
      await this.prisma.ordenes_compra.findMany({

        where: {

          id_empresa:
            BigInt(id_empresa),

          estado: 'APROBADA',

          deleted_at: null,

        },

        select: {

          fecha: true,
          total: true,

        },

      });

    /*
    AGRUPAR
    */

    const resumen: any = {};

    for (const orden of ordenes) {

      if (!orden.fecha) continue;

      const fecha =
        new Date(orden.fecha);

      const mes =

        `${fecha.getFullYear()}-${String(
          fecha.getMonth() + 1,
        ).padStart(2, '0')}`;

      if (!resumen[mes]) {

        resumen[mes] = 0;

      }

      resumen[mes] +=
        Number(orden.total);

    }

    /*
    FORMATEAR
    */

    return Object.keys(resumen).map(

      (mes) => ({

        mes,

        ventas:
          resumen[mes],

      }),

    );

  }
  /*
  ==================================================
  PRODUCTOS MAS VENDIDOS
  ==================================================
  */

  async topProducts(
    id_empresa: string,
  ) {

    const detalles =
      await this.prisma.detalle_orden_compra.findMany({

        where: {

          ordenes_compra: {

            id_empresa:
              BigInt(id_empresa),

            estado: 'APROBADA',

            deleted_at: null,

          },

        },

        select: {

          articulos: {

  select: {

    descripcion: true,

  },

},

          cantidad: true,

        },

      });

    /*
    AGRUPAR
    */

    const resumen: any = {};

    for (const item of detalles) {

      const descripcion = item.articulos.descripcion;

      if (!resumen[descripcion]) {

        resumen[descripcion] = 0;

      }

      resumen[descripcion] +=
        Number(item.cantidad);

    }

    /*
    FORMATEAR
    */

    return Object.keys(resumen).map(

      (descripcion) => ({

        descripcion_articulo:
          descripcion,

        cantidad_vendida:
          resumen[descripcion],

      }),

    ).sort(

      (a, b) =>

        b.cantidad_vendida -
        a.cantidad_vendida,

    );

  }
  async alerts(
  id_empresa: string,
) {

  /*
  STOCK BAJO
  */

  const articulos =
    await this.prisma.articulos.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

    });

  const stock_bajo =
    articulos.filter(

      (a) =>

        Number(a.stock_actual) <=
        Number(a.stock_minimo),

    ).length;

  /*
  CLIENTES DEUDORES
  */

  const clientes =
    await this.prisma.clientes.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

    });

  let clientes_deudores = 0;

  let saldo_total_clientes = 0;

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

      clientes_deudores++;

      saldo_total_clientes += saldo;

    }

  }

  return {

    stock_bajo,

    clientes_deudores,

    saldo_total_clientes,

  };

}
async executive(
  id_empresa: string,
) {

  /*
  STOCK BAJO
  */

  const articulos =
    await this.prisma.articulos.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

    });

  const stock_bajo =
    articulos.filter(

      (a) =>

        Number(a.stock_actual) <=
        Number(a.stock_minimo),

    ).length;

  /*
  CLIENTES DEUDORES
  */

  const clientes =
    await this.prisma.clientes.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

    });

  let clientes_deudores = 0;

  let saldo_total_clientes = 0;

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

      clientes_deudores++;

      saldo_total_clientes += saldo;

    }

  }

  return {

    stock_bajo,

    clientes_deudores,

    saldo_total_clientes,

  };

}
}