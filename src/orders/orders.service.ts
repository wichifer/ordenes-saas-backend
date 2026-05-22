import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()

export class OrdersService {

  constructor(private prisma: PrismaService) {}

  async findAll(id_empresa: string) {

  return this.prisma.ordenes_compra.findMany({

    where: {
      id_empresa: BigInt(id_empresa),
      deleted_at: null,
    },

    include: {

  clientes: true,

  usuarios: {

    select: {

      id_usuario: true,

      nombre: true,

      apellido: true,

      email: true,

    },

  },

},

    orderBy: {
      id_orden_compra: 'desc',
    },

  });

}
async findOne(
  id: string,
  id_empresa: string,
) {

const orden =
  await this.prisma.ordenes_compra.findFirst({

  where: {

    id_orden_compra: BigInt(id),

    id_empresa: BigInt(id_empresa),

    deleted_at: null,

  },

    include: {

      clientes: true,

      usuarios: {

  select: {

    id_usuario: true,

    nombre: true,

    apellido: true,

    email: true,

  },

},

      detalle_orden_compra: {

  include: {

    articulos: true,

  },

},

    },

  });
  if (!orden) {
    throw new NotFoundException(
  'Orden no encontrada',
);
  }
  return orden;
  

}
async create(data: any, user: any) {

  // calcular subtotales
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('Items requeridos');
    }
  const items = data.items.map((item: any) => {

    const subtotal =
      Number(item.cantidad) *
      Number(item.precio_unitario);

    return {
      ...item,
      subtotal,
    };

  });

  // calcular total
  const total = items.reduce(

    (acc: number, item: any) => {
      return acc + item.subtotal;
    },

    0,

  );

  // crear orden
  const orden = await this.prisma.ordenes_compra.create({

    data: {

      id_empresa: BigInt(user.empresa),

      id_cliente: BigInt(data.id_cliente),

      id_usuario: BigInt(user.sub),

      numero_orden: data.numero_orden,

      observaciones: data.observaciones,

      total,

    },

  });

  // crear detalles
  await this.prisma.detalle_orden_compra.createMany({

    data: items.map((item: any) => ({

      id_orden_compra: orden.id_orden_compra,

      id_articulo: BigInt(item.id_articulo),

      descripcion_articulo: item.descripcion_articulo,

      cantidad: item.cantidad,

      precio_unitario: item.precio_unitario,

      subtotal: item.subtotal,

    })),

  });

  return this.findOne(
  orden.id_orden_compra.toString(),
  user.empresa,
);

}
async remove(
  id: string,
  id_empresa: string,
) {

  const orden =
    await this.prisma.ordenes_compra.findFirst({

      where: {

        id_orden_compra: BigInt(id),

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

    });

  if (!orden) {

    throw new NotFoundException(
      'Orden no encontrada',
    );

  }

  await this.prisma.ordenes_compra.update({

    where: {
      id_orden_compra: orden.id_orden_compra,
    },

    data: {
      deleted_at: new Date(),
    },

  });

  return {
    message: 'Orden eliminada',
  };

}
async update(
  id: string,
  data: any,
  id_empresa: string,
) {

  const orden =
    await this.prisma.ordenes_compra.findFirst({

      where: {

        id_orden_compra: BigInt(id),

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

    });

  if (!orden) {

    throw new NotFoundException(
      'Orden no encontrada',
    );

  }

  await this.prisma.ordenes_compra.update({

    where: {
      id_orden_compra: orden.id_orden_compra,
    },

    data: {

      estado: data.estado,

      observaciones:
        data.observaciones,

    },

  });

  return this.findOne(
    id,
    id_empresa,
  );

}

}