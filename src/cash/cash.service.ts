import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()

export class CashService {

   constructor(
      private prisma: PrismaService,
    ) {}

async open(
  id_empresa: string,
  id_usuario: string,
  saldo_inicial: number,
) {

  const cajaAbierta =
    await this.prisma.cajas.findFirst({

      where: {

        id_empresa:
          BigInt(id_empresa),

        estado: 'ABIERTA',

      },

    });

  if (cajaAbierta) {

    throw new Error(
      'Ya existe una caja abierta',
    );

  }

  return this.prisma.cajas.create({

    data: {

      id_empresa:
        BigInt(id_empresa),

      id_usuario:
        BigInt(id_usuario),

      saldo_inicial,

      estado: 'ABIERTA',

    },

  });

}
async current(
  id_empresa: string,
) {

  return this.prisma.cajas.findFirst({

    where: {

      id_empresa:
        BigInt(id_empresa),

      estado: 'ABIERTA',

    },

  });

}
async close(
  id_empresa: string,
  saldo_final: number,
) {

  const caja =
    await this.prisma.cajas.findFirst({

      where: {

        id_empresa:
          BigInt(id_empresa),

        estado: 'ABIERTA',

      },

    });

  if (!caja) {

    throw new Error(
      'No existe una caja abierta',
    );

  }

  return this.prisma.cajas.update({

    where: {

      id_caja:
        caja.id_caja,

    },

    data: {

      fecha_cierre:
        new Date(),

      saldo_final,

      estado: 'CERRADA',

    },

  });

}
async history(
  id_empresa: string,
) {

  return this.prisma.cajas.findMany({

    where: {

      id_empresa:
        BigInt(id_empresa),

    },

    orderBy: {

      fecha_apertura: 'desc',

    },

  });

}
}
