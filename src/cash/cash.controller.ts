import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard }
from '../auth/guards/jwt.guard';


import { CashService }
from './cash.service';

@UseGuards(JwtGuard)

@Controller('cash')
export class CashController {

  constructor(

    private readonly cashService: CashService,

  ) {}
  
  @Post('close')
close(

  @Body() body: any,

  @Req() request: any,

) {

  return this.cashService.close(

    request.user.empresa,

    Number(
      body.saldo_final,
    ),

  );

}@Get('history')
history(
  @Req() request: any,
) {

  return this.cashService.history(

    request.user.empresa,

  );

}

  @Post('open')
  open(

    @Body() body: any,

    @Req() request: any,

  ) {

    return this.cashService.open(

      request.user.empresa,

      request.user.sub,

      Number(
        body.saldo_inicial,
      ),

    );

  }

 @Get('current')
current(
  @Req() request: any,
) {

  return this.cashService.current(

    request.user.empresa,

  );

}

}