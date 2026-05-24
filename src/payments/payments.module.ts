import { Module } from '@nestjs/common';

import { PaymentsController }
from './payments.controller';

import { PaymentsService }
from './payments.service';

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

  controllers: [
    PaymentsController,
  ],

  providers: [

    PaymentsService,

    JwtGuard,

  ],

})

export class PaymentsModule {}