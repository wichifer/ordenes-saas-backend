import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
@UseGuards(JwtGuard)
@Controller('companies')
export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService) {}

@Get()
findAll(@Req() request: any) {

  console.log(request.user);

return this.companiesService.findAll(
  request.user.id_empresa,
);
}

  @Post()
  create(@Body() body: any) {
    return this.companiesService.create(body);
  }

}