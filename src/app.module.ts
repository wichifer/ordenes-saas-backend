import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { CompaniesModule } from './companies/companies.module';

import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

import { OrdersModule } from './orders/orders.module';
import { ArticlesModule } from './articles/articles.module';

@Module({

  imports: [
    PrismaModule,
    CompaniesModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    ArticlesModule,
  ],

  controllers: [AppController],

  providers: [AppService],

})

export class AppModule {}