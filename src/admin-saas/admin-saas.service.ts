// admin-saas.service.ts

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSaasService {
  constructor(private prisma: PrismaService) {}

  async createCompany(dto: CreateCompanyDto) {

    //------------------------------------------------
    // VALIDAR EMPRESA EXISTENTE
    //------------------------------------------------

    const existe = await this.prisma.empresas.findFirst({
      where: {
        cuit: dto.cuit,
      },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe una empresa con ese CUIT',
      );
    }

    //------------------------------------------------
    // TRANSACCION
    //------------------------------------------------

    return this.prisma.$transaction(async (tx) => {

      //------------------------------------------------
      // EMPRESA
      //------------------------------------------------

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

      //------------------------------------------------
      // ROL ADMIN
      //------------------------------------------------

      const rolAdmin = await tx.roles.findFirst({
        where: {
          nombre: 'ADMIN',
        },
      });

      if (!rolAdmin) {
        throw new BadRequestException(
          'No existe el rol ADMIN',
        );
      }

      //------------------------------------------------
      // USUARIO ADMIN
      //------------------------------------------------

      const password_hash = await bcrypt.hash(
        dto.password,
        10,
      );

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

      //------------------------------------------------
      // CONSUMIDOR FINAL
      //------------------------------------------------

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

      //------------------------------------------------
      // CAJA PRINCIPAL
      //------------------------------------------------

      await tx.cajas.create({
        data: {
          id_empresa: empresa.id_empresa,

          id_usuario: usuario.id_usuario,

          saldo_inicial: 0,

          estado: 'ABIERTA',
        },
      });

      //------------------------------------------------
      // RESPUESTA
      //------------------------------------------------

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
}