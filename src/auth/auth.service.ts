import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuditService }
from '../audit/audit.service';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    //private auditService: AuditService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {

    const exists = await this.prisma.usuarios.findUnique({
      where: {
        email: data.email,
      },
    });

    if (exists) {
      throw new BadRequestException('Email ya registrado');
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const adminRole = await this.prisma.roles.findFirst({
      where: {
        nombre: 'ADMIN',
      },
    });

    if (!adminRole) {
      throw new BadRequestException('Rol ADMIN no existe');
    }

    const empresa = await this.prisma.empresas.create({
      data: {
        razon_social: data.razon_social,
        email: data.email,
      },
    });
    

    const usuario = await this.prisma.usuarios.create({
      data: {

        id_empresa: empresa.id_empresa,

        id_rol: adminRole.id_rol,

        nombre: data.nombre,

        apellido: data.apellido,

        email: data.email,

        password_hash,

      },
    });

    // Crear Consumidor Final por defecto
    await this.prisma.clientes.create({
      data: {
        id_empresa: empresa.id_empresa,
        razon_social: 'CONSUMIDOR FINAL',
        nombre: 'CONSUMIDOR',
        apellido: 'FINAL',
        estado: true,
      },
    });

 const token = this.jwtService.sign({
  id_usuario: usuario.id_usuario.toString(),
  email: usuario.email,
  id_empresa: empresa.id_empresa.toString(),
  rol: 'ADMIN',
});

    return {
      token,
      empresa,
      usuario,
    };

  }

async login(data: any) {

  const usuario = await this.prisma.usuarios.findUnique({
    where: {
      email: data.email,
    },

    include: {
      roles: true,
    },
  });

  if (!usuario) {
    throw new BadRequestException('Usuario no encontrado');
  }

  if (!usuario.password_hash) {
    throw new BadRequestException('Usuario sin password');
  }

  const passwordOk = await bcrypt.compare(
    data.password,
    usuario.password_hash,
  );

  if (!passwordOk) {
    throw new BadRequestException('Password incorrecto');
  }

  const token = this.jwtService.sign({
    id_usuario: usuario.id_usuario.toString(),
    email: usuario.email,
    id_empresa: usuario.id_empresa.toString(),
    rol: usuario.roles.nombre,
  });

  return {
    token,

    usuario: {
      id_usuario: usuario.id_usuario,
      id_empresa: usuario.id_empresa,
      id_rol: usuario.id_rol,

      rol: usuario.roles.nombre,

      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
    },
  };
}

}