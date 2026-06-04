import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';

import { AuditService }
from './audit.service';

import { PrismaModule }
from '../prisma/prisma.module';
import { AuthModule }
from '../auth/auth.module';

@Module({

  imports: [

    PrismaModule,

    AuthModule,

  ],

  providers: [

    AuditService,

  ],

  exports: [

    AuditService,

  ],

  controllers: [

    AuditController,

  ],

})
export class AuditModule {}