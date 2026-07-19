import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ArticlesService } from './articles.service';

import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('articles')
export class ArticlesController {

  constructor(
    private readonly articlesService: ArticlesService,
  ) {}

  @Get()
  findAll(@Req() request: any) {

    return this.articlesService.findAll(
      request.user.id_empresa,
    );

  }

  @Post()
  create(
    @Body() body: any,
    @Req() request: any,
  ) {

    return this.articlesService.create(
      body,
      request.user,
    );

  }

}