import {
  Controller,
  Query,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard }
from '../auth/guards/jwt.guard';

import { ReportsService }
from './reports.service';
@UseGuards(JwtGuard)
@Controller('reports')
export class ReportsController {

  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('debtors')
  debtors(
    @Req() request: any,
  ) {

    return this.reportsService.debtors(
      request.user.empresa,
    );

  }

  @Get('sales')
  sales(

    @Req() request: any,

    @Query('from')
    from?: string,

    @Query('to')
    to?: string,

  ) {

    return this.reportsService.sales(

      request.user.empresa,

      from,

      to,

    );

  }

  @Get('sales-by-client')
  salesByClient(
    @Req() request: any,
  ) {

    return this.reportsService.salesByClient(
      request.user.empresa,
    );

  }

}