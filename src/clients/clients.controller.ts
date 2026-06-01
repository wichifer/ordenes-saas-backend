import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard }
from '../auth/guards/jwt.guard';

import { ClientsService }
from './clients.service';

import { CreateClientDto }
from './dto/create-client.dto';

import { UpdateClientDto }
from './dto/update-client.dto';

@UseGuards(JwtGuard)

@Controller('clients')

export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  findAll(@Req() request: any) {

    return this.clientsService.findAll(
      request.user.empresa,
    );

  }

  @Get(':id')
  findOne(

    @Param('id') id: string,

    @Req() request: any,

  ) {

    return this.clientsService.findOne(
      id,
      request.user.empresa,
    );

  }
@Get(':id/saldo')
getBalance(

  @Param('id') id: string,

  @Req() request: any,

) {

  return this.clientsService.getBalance(

    id,

    request.user.empresa,

  );

}
  @Post()
  create(

    @Body() body: CreateClientDto,

    @Req() request: any,

  ) {

    return this.clientsService.create(
      body,
      request.user,
    );

  }

  @Patch(':id')
  update(

    @Param('id') id: string,

    @Body() body: UpdateClientDto,

    @Req() request: any,

  ) {

    return this.clientsService.update(
      id,
      body,
      request.user.empresa,
    );

  }

  @Delete(':id')
  remove(

    @Param('id') id: string,

    @Req() request: any,

  ) {

    return this.clientsService.remove(
      id,
      request.user.empresa,
    );

  }
@Get(':id/movimientos')
getMovimientos(

  @Param('id') id: string,

  @Req() request: any,

) {

  return this.clientsService.getMovimientos(

    id,

    request.user.empresa,

  );

}
}