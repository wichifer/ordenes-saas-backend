import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

@Delete('empresas/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN_SAAS')
removeCompany(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.service.removeCompany(id);
}
}