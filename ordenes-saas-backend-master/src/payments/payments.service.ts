import {

  Injectable,

  NotFoundException,

  BadRequestException,

} from '@nestjs/common';

import { PrismaService }

from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()

export class PaymentsService {

  constructor(

    private prisma: PrismaService,

  ) {console.log(">>> PaymentsService INSTANCIADO");}
async create(
  data: CreatePaymentDto,
  user: any,
) {

  throw new Error("ESTOY EN EL SERVICE NUEVO");

  console.log("===== CREATE PAYMENT =====");
}
  async findAll(id_empresa: string) {

    return this.prisma.pagos.findMany({

      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at: null,

      },

      include: {

        clientes: true,

        ordenes_compra: true,

      },

      orderBy: {

        id_pago: 'desc',

      },

    });

  }

async createe(
  data: CreatePaymentDto,
  user: any,
) {
  console.log("===== CREATE PAYMENT =====");
  console.log("USER:", JSON.stringify(user, null, 2));
  console.log("DATA:", JSON.stringify(data, null, 2));

  if (!user) {
    throw new Error("USER ES UNDEFINED");
  }

  if (!user.id_empresa) {
    throw new Error("FALTA user.id_empresa");
  }

  if (!data.id_orden_compra) {
    throw new Error("FALTA data.id_orden_compra");
  }

  if (!data.id_cliente) {
    throw new Error("FALTA data.id_cliente");
  }

  // ... resto del método
}
}