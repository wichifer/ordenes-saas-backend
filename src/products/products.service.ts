import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class ProductsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(id_empresa: string) {

    return this.prisma.articulos.findMany({

      where: {

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

      orderBy: {
        id_articulo: 'desc',
      },

    });

  }

  async findOne(
    id: string,
    id_empresa: string,
  ) {

    const product =
      await this.prisma.articulos.findFirst({

        where: {

          id_articulo: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }

    return product;

  }

async create(
  data: any,
  user: any,
) {

  const existing =
    await this.prisma.articulos.findFirst({

      where: {

        id_empresa: BigInt(user.id_empresa),

        codigo: data.codigo,

        deleted_at: null,

      },

    });

  if (existing) {

    throw new BadRequestException(
      'Ya existe un producto con ese código',
    );

  }

  return this.prisma.articulos.create({

    data: {

      id_empresa: BigInt(user.id_empresa),

      codigo: data.codigo,

      descripcion: data.descripcion,

      unidad_medida: data.unidad_medida ?? 'UN',

      precio_final: data.precio_final,

      stock_actual:
        data.stock_actual || 0,

      stock_minimo:
        data.stock_minimo || 0,

      estado:
        data.estado ?? true,

    },

  });

}
  async update(
    id: string,
    data: any,
    id_empresa: string,
  ) {

    const product =
      await this.prisma.articulos.findFirst({

        where: {

          id_articulo: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }
if (data.codigo) {

  const existing =
    await this.prisma.articulos.findFirst({

      where: {

        codigo: data.codigo,

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

    });

  if (
    existing &&
    existing.id_articulo !==
    product.id_articulo
  ) {

    throw new BadRequestException(
      'Ya existe un producto con ese código',
    );

  }

}
    await this.prisma.articulos.update({

      where: {
        id_articulo: product.id_articulo,
      },

      data: {

        codigo: data.codigo,

        descripcion: data.descripcion,

        unidad_medida: data.unidad_medida,

        precio_final: data.precio_final,

        stock_actual: data.stock_actual,

        stock_minimo: data.stock_minimo,

        estado: data.estado,

      },

    });

    return this.findOne(
      id,
      id_empresa,
    );

  }

  async remove(
    id: string,
    id_empresa: string,
  ) {

    const product =
      await this.prisma.articulos.findFirst({

        where: {

          id_articulo: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!product) {

      throw new NotFoundException(
        'Producto no encontrado',
      );

    }

    await this.prisma.articulos.update({

      where: {
        id_articulo: product.id_articulo,
      },

      data: {
        deleted_at: new Date(),
      },

    });

    return {
      message: 'Producto eliminado',
    };

  }
async lowStock(
  id_empresa: string,
) {
  // inicio codigo log temporal
const articulos =
  await this.prisma.articulos.findMany({
    where: {
      id_empresa: BigInt(id_empresa),
      deleted_at: null,
    },
  });

console.log(articulos);

return articulos.filter(
  (a) =>
    Number(a.stock_actual) <=
    Number(a.stock_minimo),
);
// fin codigo log temporal
  return this.prisma.articulos.findMany({

    where: {

      id_empresa: BigInt(id_empresa),

      deleted_at: null,

    },

    orderBy: {

      descripcion: 'asc',

    },

  }).then((articulos) =>

    articulos.filter(

      (a) =>

        Number(a.stock_actual) <=
        Number(a.stock_minimo),

    ),

  );

}
}