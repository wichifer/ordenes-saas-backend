import { Module } from '@nestjs/common';

import { StockMovementsController }
from './stock-movements.controller';

import { StockMovementsService }
from './stock-movements.service';

import { PrismaModule }
from '../prisma/prisma.module';

import { AuthModule }
from '../auth/auth.module';

@Module({

  imports: [

    PrismaModule,
    AuthModule,

  ],

  controllers: [

    StockMovementsController,

  ],

  providers: [

    StockMovementsService,

  ],

})

export class StockMovementsModule {}