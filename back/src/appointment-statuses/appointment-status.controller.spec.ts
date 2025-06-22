import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatusController } from './appointment-status.controller';
import { AppointmentStatusService } from './appointment-status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

describe('AppointmentStatusController', () => {
  let controller: AppointmentStatusController;
  let service: AppointmentStatusService;

  const mockService = {
    getAllStatuses: jest.fn(),
    getStatusById: jest.fn(),
    createStatus: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentStatusController],
      providers: [
        { provide: AppointmentStatusService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AppointmentStatusController>(AppointmentStatusController);
    service = module.get<AppointmentStatusService>(AppointmentStatusService);

    jest.clearAllMocks();
  });

  describe('getAllStatuses', () => {
    it('should return all appointment statuses', async () => {
      const data = [{ status_id: 1, status: 'Pendiente' }, { status_id: 2, status: 'Confirmado' }];
      mockService.getAllStatuses.mockResolvedValue(data);

      const result = await controller.getAllStatuses();

      expect(result).toBe(data);
      expect(mockService.getAllStatuses).toHaveBeenCalled();
    });
  });

  describe('getStatusById', () => {
    it('should return a status by id', async () => {
      const data = { status_id: 3, status: 'Finalizado' };
      mockService.getStatusById.mockResolvedValue(data);

      const result = await controller.getStatusById(3);

      expect(result).toBe(data);
      expect(mockService.getStatusById).toHaveBeenCalledWith(3);
    });
  });

  describe('createStatus', () => {
    it('should create a new status', async () => {
      const dto = { status: 'En proceso' };
      const created = { status_id: 4, ...dto };
      mockService.createStatus.mockResolvedValue(created);

      const result = await controller.createStatus(dto);

      expect(result).toBe(created);
      expect(mockService.createStatus).toHaveBeenCalledWith(dto);
    });
  });

});