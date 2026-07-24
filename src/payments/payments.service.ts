import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';

import { CreatePaymentDto } from './dto/create-payment.dto';

import { AuditService } from '../audit/audit.service';

import {
  CLIENT_MOVEMENT_TYPES,
} from '../clients/constants/client-movements';



@Injectable()
export class PaymentsService {


  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}



  /*
  ==================================================
  LISTAR PAGOS
  ==================================================
  */


  async findAll(
    id_empresa: string,
  ) {


    return this.prisma.pagos.findMany({


      where: {

        id_empresa:
          BigInt(id_empresa),

        deleted_at:
          null,

      },


      include: {

        clientes: true,

        ordenes_compra: true,

      },


      orderBy: {

        id_pago:
          'desc',

      },


    });


  }






  /*
  ==================================================
  CREAR PAGO
  ==================================================
  */


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
            BigInt(user.id_empresa),


          deleted_at:
            null,


        },


      });





    if (!orden) {

      throw new NotFoundException(
        'Orden no encontrada',
      );

    }





    if (
      orden.estado === 'PAGADA'
    ) {

      throw new BadRequestException(
        'La orden ya se encuentra pagada',
      );

    }





    if (
      orden.estado === 'ANULADA'
    ) {

      throw new BadRequestException(
        'No se puede registrar un pago sobre una orden anulada',
      );

    }






    const pagos =
      await this.prisma.pagos.findMany({


        where: {


          id_orden_compra:
            orden.id_orden_compra,


          deleted_at:
            null,


        },


      });





    const totalPagado =
      pagos.reduce(

        (
          acc,
          pago,
        ) =>
          acc + Number(pago.monto),

        0,

      );





    const saldo =
      Number(orden.total)
      -
      totalPagado;





    if (
      Number(data.monto) > saldo
    ) {


      throw new BadRequestException(

        `El pago supera el saldo pendiente (${saldo})`

      );


    }






    const pago =
      await this.prisma.$transaction(

        async (tx) => {



          const nuevoPago =
            await tx.pagos.create({


              data: {


                id_empresa:
                  BigInt(user.id_empresa),


                id_orden_compra:
                  orden.id_orden_compra,


                id_cliente:
                  orden.id_cliente,


                monto:
                  Number(data.monto),


                metodo_pago:
                  data.metodo_pago,


                observaciones:
                  data.observaciones,


              },


            });






          await tx.cliente_movimientos.create({


            data: {


              id_empresa:
                nuevoPago.id_empresa,


              id_cliente:
                nuevoPago.id_cliente,


              tipo_movimiento:
                CLIENT_MOVEMENT_TYPES.PAGO,


              monto:
                nuevoPago.monto,


              observacion:
                `Pago #${nuevoPago.id_pago}`,


            },


          });







          const nuevoTotalPagado =
            totalPagado
            +
            Number(data.monto);






          if (

            nuevoTotalPagado
            ===
            Number(orden.total)

          ) {



            await tx.ordenes_compra.update({


              where: {


                id_orden_compra:
                  orden.id_orden_compra,


              },


              data: {


                estado:
                  'PAGADA',


              },


            });


          }





          return nuevoPago;


        },


      );





    await this.auditService.createLog({


      id_empresa:
        user.id_empresa,


      id_usuario:
        user.id_usuario,


      tabla_afectada:
        'pagos',


      accion:
        'CREAR',


      registro_id:
        pago.id_pago.toString(),


    });




    return pago;


  }







  /*
  ==================================================
  ORDENES PENDIENTES DE PAGO
  ==================================================
  */


  async findPendingOrders(
    id_empresa: string,
  ) {



    const ordenes =
      await this.prisma.ordenes_compra.findMany({



        where: {


          id_empresa:
            BigInt(id_empresa),


          estado:
            'APROBADA',


          clientes: {


            es_consumidor_final:
              false,


          },


          deleted_at:
            null,


        },



        include: {


          clientes:
            true,


          pagos: {


            where: {


              deleted_at:
                null,


            },


          },


        },



        orderBy: {


          id_orden_compra:
            'desc',


        },


      });







    return ordenes.map((orden) => {



      const totalPagado =
        orden.pagos.reduce(

          (
            acc,
            pago,
          ) =>
            acc + Number(pago.monto),

          0,

        );




      const saldoPendiente =
        Number(orden.total)
        -
        totalPagado;






      return {


        id_orden_compra:
          orden.id_orden_compra,


        numero_orden:
          orden.numero_orden,



        cliente:

          orden.clientes.razon_social

          ||

          `${orden.clientes.nombre} ${orden.clientes.apellido ?? ''}`,


        total:
          Number(orden.total),



        total_pagado:
          totalPagado,



        saldo_pendiente:
          saldoPendiente,



      };



    });


  }


}