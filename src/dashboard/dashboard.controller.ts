import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DashboardService }
from './dashboard.service';

import { JwtGuard }
from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)

@Controller('dashboard')

export class DashboardController {

  constructor(
    private readonly dashboardService:
      DashboardService,
  ) {}
  @Get('executive')
executive(
  @Req() request: any,
) {

  return this.dashboardService.executive(
    request.user.empresa,
  );

}
  @Get('alerts')
alerts(
  @Req() request: any,
) {

  return this.dashboardService.alerts(
    request.user.empresa,
  );

}

  /*
  ==================================================
  KPIS
  ==================================================
  */

  @Get('kpis')
  getKpis(
    @Req() request: any,
  ) {

    return this.dashboardService.getKpis(
      request.user.empresa,
    );

  }

  /*
  ==================================================
  ORDENES RECIENTES
  ==================================================
  */

  @Get('recent-orders')
  recentOrders(
    @Req() request: any,
  ) {

    return this.dashboardService.recentOrders(
      request.user.empresa,
    );

  }

  /*
  ==================================================
  VENTAS POR MES
  ==================================================
  */

  @Get('sales-by-month')
  salesByMonth(
    @Req() request: any,
  ) {

    return this.dashboardService.salesByMonth(
      request.user.empresa,
    );

  }
  /*
  ==================================================
  PRODUCTOS MAS VENDIDOS
  ==================================================
  */

  @Get('top-products')
  topProducts(
    @Req() request: any,
  ) {

    return this.dashboardService.topProducts(
      request.user.empresa,
    );

  }
}