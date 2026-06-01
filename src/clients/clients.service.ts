import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import { CreateClientDto }
from './dto/create-client.dto';

import { UpdateClientDto }
from './dto/update-client.dto';

@Injectable()

export class ClientsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(id_empresa: string) {

    return this.prisma.clientes.findMany({

      where: {

        id_empresa: BigInt(id_empresa),

        deleted_at: null,

      },

      orderBy: {
        id_cliente: 'desc',
      },

    });

  }
async getBalance(
  id: string,
  id_empresa: string,
) {

  const cliente =
    await this.findOne(
      id,
      id_empresa,
    );

  const movimientos =
    await this.prisma.cliente_movimientos.findMany({

      where: {

        id_cliente: BigInt(id),

        id_empresa: BigInt(id_empresa),

      },

    });

  let debe = 0;
  let pagado = 0;

  for (const mov of movimientos) {

  const monto = Number(mov.monto);

  switch (mov.tipo_movimiento) {

    case 'VENTA':
      debe += monto;
      break;

    case 'PAGO':
    case 'NOTA_CREDITO':
      pagado += monto;
      break;
  }
}
  return {

    cliente,

    debe,

    pagado,

    saldo: debe - pagado,

  };

}
  async findOne(
    id: string,
    id_empresa: string,
  ) {

    const client =
      await this.prisma.clientes.findFirst({

        where: {

          id_cliente: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!client) {

      throw new NotFoundException(
        'Cliente no encontrado',
      );

    }

    return client;

  }

  async create(
    data: CreateClientDto,
    user: any,
  ) {

    if (data.email) {

      const existingEmail =
        await this.prisma.clientes.findFirst({

          where: {

            email: data.email,

            id_empresa: BigInt(user.empresa),

            deleted_at: null,

          },

        });

      if (existingEmail) {

        throw new BadRequestException(
          'Ya existe un cliente con ese email',
        );

      }

    }

    if (data.cuit) {

      const existingCuit =
        await this.prisma.clientes.findFirst({

          where: {

            cuit: data.cuit,

            id_empresa: BigInt(user.empresa),

            deleted_at: null,

          },

        });

      if (existingCuit) {

        throw new BadRequestException(
          'Ya existe un cliente con ese CUIT',
        );

      }

    }

   return this.prisma.clientes.create({

  data: {

    id_empresa: BigInt(user.empresa),

    nombre: data.nombre || '',

    apellido: data.apellido,

    razon_social: data.razon_social,

    documento: data.documento,

    cuit: data.cuit,

    telefono: data.telefono,

    email: data.email,

    direccion: data.direccion,

    estado: true,

  },

});
  }

  async update(
    id: string,
    data: UpdateClientDto,
    id_empresa: string,
  ) {

    const client =
      await this.prisma.clientes.findFirst({

        where: {

          id_cliente: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!client) {

      throw new NotFoundException(
        'Cliente no encontrado',
      );

    }

    if (data.email) {

      const existingEmail =
        await this.prisma.clientes.findFirst({

          where: {

            email: data.email,

            id_empresa: BigInt(id_empresa),

            deleted_at: null,

          },

        });

      if (
        existingEmail &&
        existingEmail.id_cliente !==
        client.id_cliente
      ) {

        throw new BadRequestException(
          'Ya existe un cliente con ese email',
        );

      }

    }

    if (data.cuit) {

      const existingCuit =
        await this.prisma.clientes.findFirst({

          where: {

            cuit: data.cuit,

            id_empresa: BigInt(id_empresa),

            deleted_at: null,

          },

        });

      if (
        existingCuit &&
        existingCuit.id_cliente !==
        client.id_cliente
      ) {

        throw new BadRequestException(
          'Ya existe un cliente con ese CUIT',
        );

      }

    }

    await this.prisma.clientes.update({

      where: {
        id_cliente: client.id_cliente,
      },

        data: {

    ...(data.nombre !== undefined && {
      nombre: data.nombre,
    }),

    ...(data.apellido !== undefined && {
      apellido: data.apellido,
    }),

    ...(data.razon_social !== undefined && {
      razon_social: data.razon_social,
    }),

    ...(data.documento !== undefined && {
      documento: data.documento,
    }),

    ...(data.cuit !== undefined && {
      cuit: data.cuit,
    }),

    ...(data.telefono !== undefined && {
      telefono: data.telefono,
    }),

    ...(data.email !== undefined && {
      email: data.email,
    }),

    ...(data.direccion !== undefined && {
      direccion: data.direccion,
    }),

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

    const client =
      await this.prisma.clientes.findFirst({

        where: {

          id_cliente: BigInt(id),

          id_empresa: BigInt(id_empresa),

          deleted_at: null,

        },

      });

    if (!client) {

      throw new NotFoundException(
        'Cliente no encontrado',
      );

    }

    await this.prisma.clientes.update({

      where: {
        id_cliente: client.id_cliente,
      },

      data: {
        deleted_at: new Date(),
      },

    });

    return {
      message: 'Cliente eliminado',
    };

  }
async getMovimientos(
  id: string,
  id_empresa: string,
) {

  await this.findOne(
    id,
    id_empresa,
  );

  return this.prisma.cliente_movimientos.findMany({

    where: {

      id_cliente: BigInt(id),

      id_empresa: BigInt(id_empresa),

    },

    orderBy: {

      created_at: 'desc',

    },

  });

}
}