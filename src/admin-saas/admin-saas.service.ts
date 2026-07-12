// src/admin-saas/admin-saas.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSaasService {
  constructor(private prisma: PrismaService) {}

  // ------------------------------------------------
  // CREATE COMPANY
  // ------------------------------------------------
  async createCompany(dto: CreateCompanyDto) {
    const existe = await this.prisma.empresas.findFirst({
      where: {
        cuit: dto.cuit,
      },
    });
console.log("Empresa existente:", existe);
    if (existe) {
      throw new BadRequestException(
        'Ya existe una empresa con ese CUIT',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const empresa = await tx.empresas.create({
        data: {
          razon_social: dto.razon_social,
          cuit: dto.cuit,
          email: dto.email,
          telefono: dto.telefono,
          direccion: dto.direccion,

          estado: true,
          plan_saas: 'TRIAL',
        },
      });

      const rolAdmin = await tx.roles.findFirst({
        where: {
          nombre: 'ADMIN',
        },
      });

      if (!rolAdmin) {
        throw new BadRequestException('No existe el rol ADMIN');
      }

      const password_hash = await bcrypt.hash(dto.password, 10);

      const usuario = await tx.usuarios.create({
        data: {
          id_empresa: empresa.id_empresa,
          id_rol: rolAdmin.id_rol,
          nombre: dto.nombre,
          apellido: dto.apellido,
          email: dto.usuario_email,
          password_hash,
          estado: true,
          email_verificado: true,
        },
      });

      await tx.clientes.create({
        data: {
          id_empresa: empresa.id_empresa,
          nombre: 'CONSUMIDOR',
          apellido: 'FINAL',
          razon_social: 'CONSUMIDOR FINAL',
          documento: '0',
          es_consumidor_final: true,
          estado: true,
        },
      });

      await tx.cajas.create({
        data: {
          id_empresa: empresa.id_empresa,
          id_usuario: usuario.id_usuario,
          saldo_inicial: 0,
          estado: 'ABIERTA',
        },
      });

      return {
        message: 'Empresa creada correctamente',
        empresa,
        usuario: {
          id_usuario: usuario.id_usuario,
          id_empresa: usuario.id_empresa,
          id_rol: usuario.id_rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          estado: usuario.estado,
          email_verificado: usuario.email_verificado,
        },
      };
    });
  }

  // ------------------------------------------------
  // GET ALL COMPANIES
  // ------------------------------------------------
  async findAllEmpresas() {
const empresas = await this.prisma.empresas.findMany({
  where: {
    deleted_at: null,
  },
  orderBy: {
    created_at: "desc",
  },
  include: {
    usuarios: {
      where: {
        roles: {
          nombre: "ADMIN",
        },
      },
      select: {
        email: true,
      },
      take: 1,
    },
  },
});

    return empresas.map((empresa) => ({
      id_empresa: empresa.id_empresa,
      razon_social: empresa.razon_social,
      nombre_comercial: empresa.nombre_comercial,
      cuit: empresa.cuit,
      email: empresa.email,
      telefono: empresa.telefono,
      estado: empresa.estado,
      created_at: empresa.created_at,
      usuario_admin: empresa.usuarios[0]?.email ?? null,
    }));
  }

  // ------------------------------------------------
  // DELETE (SOFT DELETE)
  // ------------------------------------------------
  async removeCompany(id: number) {
    const empresa = await this.prisma.empresas.findUnique({
      where: {
        id_empresa: id,
      },
    });

    if (!empresa) {
      throw new BadRequestException('La empresa no existe');
    }

    await this.prisma.empresas.update({
      where: {
        id_empresa: id,
      },
      data: {
        estado: false,
      },
    });

    return {
      message: 'Empresa desactivada correctamente',
    };
  }
async updateEmpresa(id: number, dto: UpdateCompanyDto) {
  const empresa = await this.prisma.empresas.findUnique({
    where: { id_empresa: id },
  });

  if (!empresa) {
    throw new BadRequestException('La empresa no existe');
  }

  return this.prisma.empresas.update({
    where: { id_empresa: id },
    data: dto,
  });
}
async findOneEmpresa(id: number) {

  const empresa =
    await this.prisma.empresas.findUnique({
      where: {
        id_empresa: id,
      },
    });


  if (!empresa) {
    throw new NotFoundException(
      'Empresa no encontrada'
    );
  }


  return empresa;
}
async dashboard() {
  const [
    empresas,
    empresasActivas,
    empresasSuspendidas,
    usuarios,
  ] = await Promise.all([
    this.prisma.empresas.count(),

    this.prisma.empresas.count({
      where: {
        estado: true,
      },
    }),

    this.prisma.empresas.count({
      where: {
        estado: false,
      },
    }),

    this.prisma.usuarios.count(),
  ]);

  return {
    empresas,
    empresasActivas,
    empresasSuspendidas,
    usuarios,
  };
}
async updateCompanyStatus(
  id: number,
  estado: boolean,
) {
  return this.prisma.empresas.update({
    where: {
      id_empresa: BigInt(id),
    },
    data: {
      estado,
    },
  });
}

}