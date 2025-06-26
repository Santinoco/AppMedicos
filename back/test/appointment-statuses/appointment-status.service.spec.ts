import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentStatusService } from '../../src/appointment-statuses/appointment-status.service';
import { AppointmentStatus } from '../../src/appointment-statuses/entities/appointment-status.model';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('AppointmentStatusService', () => {
  let service: AppointmentStatusService;
  let statusRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentStatusService,
        { provide: getRepositoryToken(AppointmentStatus), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<AppointmentStatusService>(AppointmentStatusService);
    statusRepo = module.get(getRepositoryToken(AppointmentStatus));

    // @ts-ignore
    service.appointmentStatusRepository = statusRepo;

    jest.clearAllMocks();
  });

  describe('getAllStatuses', () => {
    it('should return all statuses ordered by status_id ASC', async () => {
      const expected = [{ status_id: 1, status: 'Pendiente' }, { status_id: 2, status: 'Confirmado' }];
      statusRepo.find.mockResolvedValue(expected);

      const result = await service.getAllStatuses();

      expect(result).toBe(expected);
      expect(statusRepo.find).toHaveBeenCalledWith({ order: { status_id: "ASC" } });
    });
  });

  describe('getStatusById', () => {
    it('should return the status when it exists', async () => {
      const statusData = { status_id: 1, status: 'Pendiente' };
      statusRepo.findOne.mockResolvedValue(statusData);

      const result = await service.getStatusById(1);

      expect(result).toBe(statusData);
      expect(statusRepo.findOne).toHaveBeenCalledWith({ where: { status_id: 1 } });
    });

    it('should return null if status does not exist', async () => {
      statusRepo.findOne.mockResolvedValue(null);
      const result = await service.getStatusById(999);
      expect(result).toBeNull();
      expect(statusRepo.findOne).toHaveBeenCalledWith({ where: { status_id: 999 } });
    });
  });

  describe('createStatus', () => {
    it('should create and save a status', async () => {
      const dto = { status: 'Nuevo estado' };
      const created = { ...dto };
      const saved = { status_id: 8, ...dto };

      statusRepo.create.mockReturnValue(created);
      statusRepo.save.mockResolvedValue(saved);

      const result = await service.createStatus(dto);

      expect(statusRepo.create).toHaveBeenCalledWith(dto);
      expect(statusRepo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(saved);
    });
  });

});