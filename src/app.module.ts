import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { CompaniesModule } from './companies/companies.module';

import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

import { OrdersModule } from './orders/orders.module';
import { ArticlesModule } from './articles/articles.module';
import { ProductsModule } from './products/products.module';
import { ClientsModule } from './clients/clients.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { PaymentsModule } from './payments/payments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditModule } from './audit/audit.module';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { CashModule } from './cash/cash.module';

//import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminSaasModule } from './admin-saas/admin-saas.module';

@Module({

  imports: [


  PrismaModule,
  CompaniesModule,
  UsersModule,
  AuthModule,
  OrdersModule,
  ArticlesModule,
  ProductsModule,
  ClientsModule,
  StockMovementsModule,
  PaymentsModule,
  DashboardModule,
  AuditModule,
  ReportsModule,
  CashModule,
  AdminSaasModule,

],
  controllers: [AppController],

  providers: [AppService,

  ],

})

export class AppModule {}