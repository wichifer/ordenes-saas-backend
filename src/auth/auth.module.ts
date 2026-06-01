import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

console.log(
  'JWT SECRET =>',
  process.env.JWT_SECRET,
);

@Module({
  imports: [
    AuditModule,

    PrismaModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [
    JwtModule,
  ],
})
export class AuthModule {}