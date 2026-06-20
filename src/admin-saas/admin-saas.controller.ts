import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AdminSaasService } from './admin-saas.service';

import { CreateCompanyDto } from './dto/create-company.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin-saas')
export class AdminSaasController {
  constructor(
    private readonly service: AdminSaasService,
  ) {}

  @Get('empresas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SAAS')
  findAllEmpresas() {
    return this.service.findAllEmpresas();
  }

  @Post('empresas')
  createCompany(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.service.createCompany(dto);
  }
}