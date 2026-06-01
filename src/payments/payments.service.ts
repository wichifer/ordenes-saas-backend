import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PaymentsService {

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll(id_empresa: string) {

    return this.prisma.pagos.findMany({

      where: {

        id_empresa: BigInt(id_empresa),

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
    data: CreatePaymentDto,
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

    const pagos =
      await this.prisma.pagos.findMany({

        where: {

          id_orden_compra:
            orden.id_orden_compra,

          deleted_at: null,

        },

      });

    const totalPagado =
      pagos.reduce(

        (acc, pago) =>
          acc + Number(pago.monto),

        0,

      );

    const saldo =
      Number(orden.total) -
      totalPagado;

    if (
      Number(data.monto) > saldo
    ) {

      throw new BadRequestException(
        `El pago supera el saldo pendiente (${saldo})`,
      );

    }

    const pago =
      await this.prisma.pagos.create({

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

    await this.prisma.cliente_movimientos.create({

      data: {

        id_empresa:
          pago.id_empresa,

        id_cliente:
          pago.id_cliente,

        tipo_movimiento:
          'PAGO',

        monto:
          pago.monto,

        observacion:
          `Pago #${pago.id_pago}`,

      },

    });

    return pago;

  }

}