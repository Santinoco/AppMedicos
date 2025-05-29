import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatusController } from './appointment-status.controller';

describe('AppointmentStatusController', () => {
  let controller: AppointmentStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentStatusController],
    }).compile();

    controller = module.get<AppointmentStatusController>(AppointmentStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
