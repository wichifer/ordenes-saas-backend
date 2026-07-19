// src/admin-saas/admin-saas.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AdminSaasService } from './admin-saas.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('admin-saas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN_SAAS')
export class AdminSaasController {
  constructor(
    private readonly adminSaasService: AdminSaasService,
  ) {}

  @Get('empresas')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN_SAAS')
  async findAllEmpresas() {
    console.log('🔥 ENTRE AL CONTROLLER EMPRESAS');

    const result = await this.adminSaasService.findAllEmpresas();

    console.log('🔥 EMPRESAS DEVUELTAS:', result.length);

    return result;
  }

  @Get('empresas/:id')
  findOneEmpresa(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminSaasService.findOneEmpresa(id);
  }

  @Post('empresas')
  createCompany(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.adminSaasService.createCompany(dto);
  }

  @Put('empresas/:id')
  updateEmpresa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.adminSaasService.updateEmpresa(id, dto);
  }

  @Patch('empresas/:id/estado')
  updateCompanyStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyStatusDto,
  ) {
    return this.adminSaasService.updateCompanyStatus(
      id,
      dto.estado,
    );
  }

  @Delete('empresas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SAAS')
  removeCompany(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminSaasService.removeCompany(id);
  }

  @Get('dashboard')
  dashboard() {
    return this.adminSaasService.dashboard();
  }
}