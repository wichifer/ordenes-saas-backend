// src/companies/companies.service.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()

export class CompaniesService {

  constructor(private prisma: PrismaService) {}

  async findAll(id_empresa: string) {

    return this.prisma.empresas.findMany({

      where: {
        id_empresa: BigInt(id_empresa),
      },

    });

  }

async create(data: any) {
  console.log(">>> ENTRE A CompaniesService.create");

  return this.prisma.empresas.create({
    data,
  });
}

}