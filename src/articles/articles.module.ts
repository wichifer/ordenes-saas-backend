import { Module } from '@nestjs/common';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

import { PrismaModule } from '../prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';

@Module({

  imports: [
    PrismaModule,
    JwtModule,
  ],

  controllers: [ArticlesController],

  providers: [ArticlesService],

})
export class ArticlesModule {}