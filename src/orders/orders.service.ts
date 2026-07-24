// src/orders/orders.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { AuditService } from '../audit/audit.service';

import {
  CLIENT_MOVEMENT_TYPES,
} from '../clients/constants/client-movements';


@Injectable()
export class OrdersService {

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}


  /*
  ==================================================
  LISTAR ORDENES
  ==================================================
  */

  async findAll(id_empresa: string) {

    const orders =
      await this.prisma.ordenes_compra.findMany({

        where: {
          id_empresa: BigInt(id_empresa),
          deleted_at: null,
        },

        include: {

          clientes: true,

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
          id_orden_compra: 'desc',
        },

      });


    return orders.map((order) => ({

      ...order,

      cliente:
        order.clientes?.razon_social
          ? order.clientes.razon_social
          :
          `${order.clientes?.nombre ?? ''} ${order.clientes?.apellido ?? ''}`.trim(),

    }));

  }



  /*
  ==================================================
  OBTENER UNA ORDEN
  ==================================================
  */

  async findOne(
    id: string,
    id_empresa: string,
  ) {

    const orden =
      await this.prisma.ordenes_compra.findFirst({

        where: {

          id_orden_compra: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },


        include: {


          clientes: true,


          usuarios: {

            select: {

              id_usuario: true,
              nombre: true,
              apellido: true,
              email: true,

            },

          },


          detalle_orden_compra: {

            include: {

              articulos: true,

            },

          },


          pagos: {

            where: {

              deleted_at: null,

            },

          },


        },

      });


    return orden;

  }





  /*
  ==================================================
  CREAR ORDEN
  ==================================================
  */

  async create(
    body: CreateOrderDto,
    user: any,
  ) {


    let numeroOrden = 'OC-0001';


    const ultimaOrden =
      await this.prisma.ordenes_compra.findFirst({

        where: {

          id_empresa:
            BigInt(user.id_empresa),

        },

        orderBy: {

          id_orden_compra: 'desc',

        },

      });



    if (ultimaOrden) {


      const ultimoNumero =
        Number(
          ultimaOrden.numero_orden.replace('OC-', ''),
        );


      numeroOrden =
        `OC-${String(
          ultimoNumero + 1,
        ).padStart(4, '0')}`;


    }



    /*
    VALIDACIONES
    */


    if (
      !body.items ||
      !Array.isArray(body.items)
    ) {

      throw new BadRequestException(
        'Items requeridos',
      );

    }



    if (
      body.items.length === 0
    ) {

      throw new BadRequestException(
        'La orden debe contener al menos un producto',
      );

    }



    for (const item of body.items) {


      if (
        Number(item.cantidad) <= 0
      ) {

        throw new BadRequestException(
          'La cantidad debe ser mayor a cero',
        );

      }


      if (
        Number(item.precio_unitario) < 0
      ) {

        throw new BadRequestException(
          'El precio no puede ser negativo',
        );

      }

    }





    /*
    CALCULAR ITEMS
    */


    const items =
      body.items.map((item: any) => {


        const subtotal =
          Number(item.cantidad) *
          Number(item.precio_unitario);



        return {

          ...item,

          subtotal,

        };


      });



    const total =
      items.reduce(

        (
          acc: number,
          item: any,
        ) => {

          return acc + item.subtotal;

        },

        0,

      );



    if (total <= 0) {

      throw new BadRequestException(
        'La orden debe tener un importe mayor a cero',
      );

    }




    console.log(
      'BODY:',
      body,
    );


    console.log(
      'USER:',
      user,
    );





    /*
    CREAR CABECERA
    */


    const orden =
      await this.prisma.ordenes_compra.create({

        data: {


          id_empresa:
            BigInt(user.id_empresa),


          id_cliente:
            BigInt(body.id_cliente),


          id_usuario:
            BigInt(user.id_usuario),


          numero_orden:
            numeroOrden,


          observaciones:
            body.observaciones,


          total,


        },

      });






    /*
    CREAR DETALLES
    */


    await this.prisma.detalle_orden_compra.createMany({

      data:

        items.map((item: any) => ({


          id_orden_compra:
            orden.id_orden_compra,


          id_articulo:
            BigInt(item.id_articulo),


          descripcion_articulo:
            item.descripcion_articulo,


          cantidad:
            item.cantidad,


          precio_unitario:
            item.precio_unitario,


          subtotal:
            item.subtotal,


        })),


    });






    /*
    APROBACION AUTOMATICA
    La diferencia consumidor/cliente
    la resuelve update()
    */


    await this.update(

      orden.id_orden_compra.toString(),

      {
        estado: 'APROBADA',
      },

      user.id_empresa,

    );






    /*
    AUDITORIA
    */


    await this.auditService.createLog({

      id_empresa:
        user.id_empresa,


      id_usuario:
        user.id_usuario,


      tabla_afectada:
        'ordenes_compra',


      accion:
        'CREAR',


      registro_id:
        orden.id_orden_compra.toString(),


    });






    return this.findOne(

      orden.id_orden_compra.toString(),

      user.id_empresa,

    );


  }
    /*
  ==================================================
  ELIMINAR ORDEN
  ==================================================
  */

  async remove(
    id: string,
    id_empresa: string,
  ) {


    const orden =
      await this.prisma.ordenes_compra.findFirst({

        where: {

          id_orden_compra:
            BigInt(id),

          id_empresa:
            BigInt(id_empresa),

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
      orden.estado !== 'PENDIENTE'
    ) {

      throw new BadRequestException(
        'Solo se pueden eliminar órdenes pendientes',
      );

    }



    const pagoActivo =
      await this.prisma.pagos.findFirst({

        where: {

          id_orden_compra:
            orden.id_orden_compra,

          deleted_at:
            null,

        },

      });



    if (pagoActivo) {

      throw new BadRequestException(
        'No se puede eliminar una orden con pagos registrados',
      );

    }



    await this.prisma.ordenes_compra.update({

      where: {

        id_orden_compra:
          orden.id_orden_compra,

      },

      data: {

        deleted_at:
          new Date(),

      },

    });



    return {

      message:
        'Orden eliminada',

    };

  }





  /*
  ==================================================
  ACTUALIZAR ORDEN
  ==================================================
  */

  async update(
    id: string,
    data: UpdateOrderDto,
    id_empresa: string,
  ) {


    const orden =
      await this.prisma.ordenes_compra.findFirst({

        where: {

          id_orden_compra:
            BigInt(id),

          id_empresa:
            BigInt(id_empresa),

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
      orden.estado === 'ENTREGADA'
    ) {

      throw new BadRequestException(
        'La orden ya fue entregada',
      );

    }



    if (
      orden.estado === 'ANULADA'
    ) {

      throw new BadRequestException(
        'La orden está anulada',
      );

    }





    /*
    ==================================================
    APROBAR ORDEN
    ==================================================
    */

    if (

      orden.estado === 'PENDIENTE'

      &&

      data.estado === 'APROBADA'

    ) {



      const detalles =
        await this.prisma.detalle_orden_compra.findMany({

          where: {

            id_orden_compra:
              orden.id_orden_compra,

          },

        });




      await this.prisma.$transaction(

        async (tx) => {



          /*
          DESCONTAR STOCK
          */


          for (const item of detalles) {



            const articulo =
              await tx.articulos.findFirst({

                where: {

                  id_articulo:
                    item.id_articulo,

                  id_empresa:
                    BigInt(id_empresa),

                  deleted_at:
                    null,

                },

              });



            if (!articulo) {

              throw new NotFoundException(

                `Artículo ${item.descripcion_articulo} no encontrado`

              );

            }




            if (

              Number(articulo.stock_actual)

              <

              Number(item.cantidad)

            ) {


              throw new BadRequestException(

                `Stock insuficiente para ${item.descripcion_articulo}`

              );


            }




            await tx.articulos.update({

              where: {

                id_articulo:
                  articulo.id_articulo,

              },

              data: {

                stock_actual:

                  Number(articulo.stock_actual)

                  -

                  Number(item.cantidad),

              },

            });





            await tx.stock_movimientos.create({

              data: {

                id_empresa:
                  BigInt(id_empresa),

                id_articulo:
                  articulo.id_articulo,

                tipo_movimiento:
                  'SALIDA',

                cantidad:
                  item.cantidad,

                referencia:
                  orden.numero_orden,

              },

            });


          }





          const cliente =
            await tx.clientes.findFirst({

              where: {

                id_cliente:
                  orden.id_cliente,

              },

            });





          /*
          ==========================================
          CONSUMIDOR FINAL
          ==========================================
          */


          if (
            cliente?.es_consumidor_final
          ) {



            await tx.ordenes_compra.update({

              where: {

                id_orden_compra:
                  orden.id_orden_compra,

              },

              data: {

                estado:
                  'PAGADA',

                observaciones:
                  data.observaciones,

              },

            });





            await tx.pagos.create({

              data: {

                id_empresa:
                  orden.id_empresa,


                id_cliente:
                  orden.id_cliente,


                id_orden_compra:
                  orden.id_orden_compra,


                monto:
                  orden.total,


                metodo_pago:
                  'EFECTIVO',

              },

            });



          }



          /*
          ==========================================
          CLIENTE REGISTRADO
          ==========================================
          */


          else {


            await tx.ordenes_compra.update({

              where: {

                id_orden_compra:
                  orden.id_orden_compra,

              },

              data: {

                estado:
                  'APROBADA',

                observaciones:
                  data.observaciones,

              },

            });





            await tx.cliente_movimientos.create({

              data: {

                id_empresa:
                  orden.id_empresa,


                id_cliente:
                  orden.id_cliente,


                tipo_movimiento:
                  CLIENT_MOVEMENT_TYPES.VENTA,


                monto:
                  orden.total,


                observacion:
                  `Orden ${orden.numero_orden}`,

              },

            });


          }



        },

        {
          timeout:
            15000,
        },

      );



      return this.findOne(
        id,
        id_empresa,
      );

    }






    /*
    ==================================================
    ANULAR ORDEN
    ==================================================
    */


    if (

      ['APROBADA','PAGADA']

      .includes(orden.estado)

      &&

      data.estado === 'ANULADA'

    ) {



      const detalles =
        await this.prisma.detalle_orden_compra.findMany({

          where: {

            id_orden_compra:
              orden.id_orden_compra,

          },

        });





      await this.prisma.$transaction(

        async (tx) => {



          for (const item of detalles) {



            const articulo =
              await tx.articulos.findFirst({

                where: {

                  id_articulo:
                    item.id_articulo,

                  id_empresa:
                    BigInt(id_empresa),

                  deleted_at:
                    null,

                },

              });



            if (!articulo) {

              throw new NotFoundException(

                `Artículo ${item.descripcion_articulo} no encontrado`

              );

            }




            await tx.articulos.update({

              where: {

                id_articulo:
                  articulo.id_articulo,

              },

              data: {

                stock_actual:

                  Number(articulo.stock_actual)

                  +

                  Number(item.cantidad),

              },

            });





            await tx.stock_movimientos.create({

              data: {

                id_empresa:
                  BigInt(id_empresa),

                id_articulo:
                  articulo.id_articulo,

                tipo_movimiento:
                  'ENTRADA',

                cantidad:
                  item.cantidad,

                referencia:
                  `Anulación ${orden.numero_orden}`,

              },

            });



          }





          await tx.cliente_movimientos.create({

            data: {

              id_empresa:
                orden.id_empresa,


              id_cliente:
                orden.id_cliente,


              tipo_movimiento:
                CLIENT_MOVEMENT_TYPES.NOTA_CREDITO,


              monto:
                orden.total,


              observacion:
                `Anulación ${orden.numero_orden}`,

            },

          });





          await tx.ordenes_compra.update({

            where: {

              id_orden_compra:
                orden.id_orden_compra,

            },

            data: {

              estado:
                'ANULADA',


              observaciones:
                data.observaciones
                ??
                'Anulada',

            },

          });



        },

      );



      return this.findOne(
        id,
        id_empresa,
      );


    }





    /*
    ==================================================
    ACTUALIZACION NORMAL
    ==================================================
    */


    await this.prisma.ordenes_compra.update({

      where: {

        id_orden_compra:
          orden.id_orden_compra,

      },

      data: {

        estado:
          data.estado,

        observaciones:
          data.observaciones,

      },

    });



    return this.findOne(
      id,
      id_empresa,
    );


  }

}