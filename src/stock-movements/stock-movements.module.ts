import { Module } from '@nestjs/common';

import { PrismaModule }
from '../prisma/prisma.module';

import { StockMovementsService }
from './stock-movements.service';

@Module({

  imports: [PrismaModule],

  providers: [StockMovementsService],

  exports: [StockMovementsService],

})

export class StockMovementsModule {}