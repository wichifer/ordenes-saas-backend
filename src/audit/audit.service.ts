import { Injectable } from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class AuditService {

  constructor(
    private prisma: PrismaService,
  ) {}

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