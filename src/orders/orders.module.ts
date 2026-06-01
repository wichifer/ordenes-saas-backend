import { Module } from '@nestjs/common';

import { OrdersController }
from './orders.controller';

import { OrdersService }
from './orders.service';

import { PrismaModule }
from '../prisma/prisma.module';

import { AuthModule }
from '../auth/auth.module';

import { AuditModule }
from '../audit/audit.module';

@Module({

  imports: [

    PrismaModule,

    AuthModule,

    AuditModule,

  ],

  controllers: [
    OrdersController,
  ],

  providers: [

    OrdersService,

  ],

})

export class OrdersModule {}