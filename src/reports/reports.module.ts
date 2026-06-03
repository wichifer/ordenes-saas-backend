import { Module } from '@nestjs/common';

import { PrismaModule }
from '../prisma/prisma.module';

import { ReportsController }
from './reports.controller';

import { ReportsService }
from './reports.service';
import { AuthModule }
from '../auth/auth.module';

@Module({

  imports: [

    PrismaModule,

    AuthModule,

  ],

  controllers: [
    ReportsController,
  ],

  providers: [
    ReportsService,
  ],

})

export class ReportsModule {}