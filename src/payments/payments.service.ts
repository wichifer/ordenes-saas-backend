import {

  Injectable,

  NotFoundException,

  BadRequestException,

} from '@nestjs/common';

import { PrismaService }

from '../prisma/prisma.service';

@Injectable()

export class PaymentsService {

  constructor(

    private prisma: PrismaService,

  ) {}

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

  async create(

    data: any,

    user: any,

  ) {

    const orden =

      await this.prisma.ordenes_compra.findFirst({

        where: {

          id_orden_compra:
            BigInt(data.id_orden_compra),

          id_empresa:
            BigInt(user.empresa),

          deleted_at: null,

        },

      });
      if (!orden) {

  throw new NotFoundException(
    'Orden no encontrada',
  );

}

    if (!orden) {

      throw new NotFoundException(

        'Orden no encontrada',

      );

    }

    /*
      PAGOS EXISTENTES
    */

    const pagos =

      await this.prisma.pagos.findMany({

        where: {

          id_orden_compra:
            orden.id_orden_compra,

          deleted_at: null,

        },

      });

    /*
      TOTAL PAGADO
    */

    const totalPagado =

      pagos.reduce(

        (acc, pago) =>

          acc + Number(pago.monto),

        0,

      );

    /*
      SALDO
    */

    const saldo =

      Number(orden.total) -
      totalPagado;

    /*
      VALIDAR MONTO
    */

    if (

      Number(data.monto) > saldo

    ) {

      throw new BadRequestException(

        `El pago supera el saldo pendiente (${saldo})`,

      );

    }

    /*
      CREAR PAGO
    */

    return this.prisma.pagos.create({

      data: {

        id_empresa:
          BigInt(user.empresa),

        id_orden_compra:
          BigInt(data.id_orden_compra),

        id_cliente:
          BigInt(data.id_cliente),

        monto:
          Number(data.monto),

        metodo_pago:
          data.metodo_pago,

        observaciones:
          data.observaciones,

      },

    });

  }

}