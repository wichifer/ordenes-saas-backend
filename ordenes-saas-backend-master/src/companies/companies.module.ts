import { Module } from '@nestjs/common';

import { CompaniesController } from './companies.controller';

import { CompaniesService } from './companies.service';

import { PrismaModule } from '../prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';

@Module({

  imports: [

  PrismaModule,

  JwtModule.register({
    secret: process.env.JWT_SECRET,
  }),

],


  controllers: [CompaniesController],

  providers: [CompaniesService],

})

export class CompaniesModule {}