import { Module } from '@nestjs/common';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

import { JwtGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditModule,
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