import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatusService } from './appointment-status.service';

describe('AppointmentStatusService', () => {
  let service: AppointmentStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentStatusService],
    }).compile();

    service = module.get<AppointmentStatusService>(AppointmentStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
