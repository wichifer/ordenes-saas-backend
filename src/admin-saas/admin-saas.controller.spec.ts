import { Test, TestingModule } from '@nestjs/testing';
import { AdminSaasController } from './admin-saas.controller';

describe('AdminSaasController', () => {
  let controller: AdminSaasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSaasController],
    }).compile();

    controller = module.get<AdminSaasController>(AdminSaasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
