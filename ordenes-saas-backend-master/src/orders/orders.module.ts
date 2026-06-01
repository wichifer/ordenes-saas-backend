import { Module } from '@nestjs/common';

import { OrdersController }
from './orders.controller';

import { OrdersService }
from './orders.service';

import { PrismaModule }
from '../prisma/prisma.module';

import { JwtModule }
from '@nestjs/jwt';

import { JwtGuard }
from '../auth/guards/jwt.guard';

@Module({

  imports: [

    PrismaModule,

    JwtModule.register({

      secret: process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '1d',
      },

    }),

    
  ],

  controllers: [OrdersController],

  providers: [

    OrdersService,

    JwtGuard,

  ],

})

export class OrdersModule {}