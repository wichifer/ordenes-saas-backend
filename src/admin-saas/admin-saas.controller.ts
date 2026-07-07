
import { Body, Controller, Get, Post, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';


import { CreateCompanyDto } from './dto/create-company.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AdminSaasService } from './admin-saas.service';
@Controller('admin-saas')
export class AdminSaasController {
  constructor(
    private readonly adminSaasService: AdminSaasService,
  ) {}

  @Get('empresas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SAAS')
  findAllEmpresas() {
    return this.adminSaasService.findAllEmpresas();
  }

  @Post('empresas')
  createCompany(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.adminSaasService.createCompany(dto);
  }

  @Delete('empresas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SAAS')
  removeCompany(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminSaasService.removeCompany(id);
  }

  @Put('empresas/:id')
  updateEmpresa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.adminSaasService.updateEmpresa(id, dto);
  }
}