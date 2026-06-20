import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AdminSaasService } from './admin-saas.service';

import { CreateCompanyDto }
from './dto/create-company.dto';

@Controller('admin-saas')
export class AdminSaasController {

  constructor(
    private readonly service: AdminSaasService,
  ) {}

  @Post('empresas')
  createCompany(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.service.createCompany(dto);
  }
}