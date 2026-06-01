import { Module } from '@nestjs/common';

import { ArticlesController }
from './articles.controller';

import { ArticlesService }
from './articles.service';

import { PrismaModule }
from '../prisma/prisma.module';

import { JwtModule }
from '@nestjs/jwt';

import { JwtGuard }
from '../auth/guards/jwt.guard';

@Module({

  imports: [

    PrismaModule,

    JwtModule.register({

      secret: process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '1d',
      },

    }),

  ],

  controllers: [
    ArticlesController,
  ],

  providers: [

    ArticlesService,

    JwtGuard,

  ],

})

export class ArticlesModule {}