import { Injectable } from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class AuditService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
  id_empresa: string,
  tabla?: string,
  accion?: string,
) {
const where: any = {

  id_empresa:
    BigInt(id_empresa),

};

if (tabla) {

  where.tabla_afectada =
    tabla;

}

if (accion) {

  where.accion =
    accion;

}
return this.prisma.auditoria_logs.findMany({

  where,

    include: {

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

      fecha: 'desc',

    },

    take: 100,

  });

}

  async createLog(

    data: {

      id_empresa?: string;

      id_usuario?: string;

      tabla_afectada?: string;

      accion?: string;

      registro_id?: string;

      ip_origen?: string;

    },

  ) {

    return this.prisma.auditoria_logs.create({

      data: {

        id_empresa:
          data.id_empresa
            ? BigInt(data.id_empresa)
            : null,

        id_usuario:
          data.id_usuario
            ? BigInt(data.id_usuario)
            : null,

        tabla_afectada:
          data.tabla_afectada,

        accion:
          data.accion,

        registro_id:
          data.registro_id
            ? BigInt(data.registro_id)
            : null,

        ip_origen:
          data.ip_origen,

      },

    });

  }

}