import {
  Controller,
  Get,
  Query,
  Req,
 
} from '@nestjs/common';


import { AuditService }
from './audit.service';



@Controller('audit')

export class AuditController {

  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Get()
  findAll(

    @Req() request: any,

    @Query('tabla')
    tabla?: string,

    @Query('accion')
    accion?: string,

  ) {

  return this.auditService.findAll(
  '1',
  tabla,
  accion,
);

  }

}