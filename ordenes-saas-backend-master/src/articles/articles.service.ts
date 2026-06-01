import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {

  constructor(private prisma: PrismaService) {}

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

  async create(data: any, user: any) {

    return this.prisma.articulos.create({

      data: {

        id_empresa: BigInt(user.empresa),

        codigo: data.codigo,

        descripcion: data.descripcion,

        precio_final: data.precio_final,

        stock_actual: data.stock_actual || 0,

        stock_minimo: data.stock_minimo || 0,

        estado: true,

      },

    });

  }

}