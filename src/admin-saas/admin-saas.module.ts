import { Module } from '@nestjs/common';
import { AdminSaasService } from './admin-saas.service';
import { AdminSaasController } from './admin-saas.controller';

@Module({
  providers: [AdminSaasService],
  controllers: [AdminSaasController]
})
export class AdminSaasModule {}
