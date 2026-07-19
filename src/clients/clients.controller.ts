import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ClientsService } from './clients.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  findAll(@Req() req) {
    return this.clientsService.findAll(
      req.user.id_empresa,
    );
  }

  @Get('consumidor-final')
  getConsumidorFinal(@Req() req) {
    return this.clientsService.getConsumidorFinal(
      BigInt(req.user.id_empresa),
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.clientsService.findOne(
      id,
      req.user.id_empresa,
    );
  }

  @Get(':id/saldo')
  getSaldo(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.clientsService.getBalance(
      id,
      req.user.id_empresa,
    );
  }

  
  @Get(':id/movimientos')
  getMovimientos(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.clientsService.getMovimientos(
      id,
      req.user.id_empresa,
    );
  }

  @Get(':id/estado-cuenta')
  accountStatement(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.clientsService.accountStatement(
      id,
      req.user.id_empresa,
    );
  }

  @Post()
  create(
    @Body() dto: CreateClientDto,
    @Req() req,
  ) {
    return this.clientsService.create(
      dto,
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @Req() req,
  ) {
    return this.clientsService.update(
      id,
      dto,
      req.user.id_empresa,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.clientsService.remove(
      id,
      req.user.id_empresa,
    );
  }
}