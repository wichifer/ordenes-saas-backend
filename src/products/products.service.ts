import {
  Injectable,
  NotFoundException,
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

        id_empresa: BigInt(user.empresa),

        codigo: data.codigo,

        deleted_at: null,

      },

    });

  if (existing) {

    throw new Error(
      'Ya existe un producto con ese código',
    );

  }

  return this.prisma.articulos.create({

    data: {

      id_empresa: BigInt(user.empresa),

      codigo: data.codigo,

      descripcion: data.descripcion,

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

    throw new Error(
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

}