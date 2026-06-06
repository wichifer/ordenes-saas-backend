import { Module } from '@nestjs/common';

import { CashController } from './cash.controller';
import { CashService } from './cash.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule }
from '../auth/auth.module';
@Module({

  imports: [
    PrismaModule,
     AuthModule,
  ],

  controllers: [
    CashController,
  ],

  providers: [
    CashService,
  ],

})

export class CashModule {}