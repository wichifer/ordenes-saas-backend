import { Test, TestingModule } from '@nestjs/testing';
import { AdminSaasService } from './admin-saas.service';

describe('AdminSaasService', () => {
  let service: AdminSaasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSaasService],
    }).compile();

    service = module.get<AdminSaasService>(AdminSaasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
