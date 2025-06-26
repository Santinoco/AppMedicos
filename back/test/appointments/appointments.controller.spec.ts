import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from '../../src/appointments/appointments.controller';
import { AppointmentsService } from '../../src/appointments/appointments.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/roles/roles.guard';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockService = {
    getAllAppointments: jest.fn(),
    getAppointmentById: jest.fn(),
    createAppointment: jest.fn(),
    updateAppointmentStatus: jest.fn(),
    findByDoctorId: jest.fn(),
    findByPatientId: jest.fn(),
    deleteAppointment: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);

    jest.clearAllMocks();
  });

  describe('getAllAppointments', () => {
    it('should return all appointments', async () => {
      const data = [{ id: 1 }];
      mockService.getAllAppointments.mockResolvedValue(data);

      const result = await controller.getAllAppointments();

      expect(result).toBe(data);
      expect(mockService.getAllAppointments).toHaveBeenCalled();
    });
  });

  describe('getAppointmentById', () => {
    it('should return an appointment by id', async () => {
      const data = { id: 7, motivo: 'Prueba' };
      mockService.getAppointmentById.mockResolvedValue(data);

      const result = await controller.getAppointmentById(7);

      expect(result).toBe(data);
      expect(mockService.getAppointmentById).toHaveBeenCalledWith(7);
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const dto = { motivo: 'X', doctor_id: 1, patient_id: 2, slot_datetime: '2024-06-06T09:30' };
      const data = { ...dto, id: 5 };

      mockService.createAppointment.mockResolvedValue(data);

      const result = await controller.createAppointment(dto);

      expect(result).toBe(data);
      expect(mockService.createAppointment).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateStatus', () => {
    it('should update status of an appointment', async () => {
      const data = { id: 9, estado_id: 2 };
      mockService.updateAppointmentStatus.mockResolvedValue(data);

      const result = await controller.updateStatus(9, 2);

      expect(result).toBe(data);
      expect(mockService.updateAppointmentStatus).toHaveBeenCalledWith(9, 2);
    });
  });

  describe('getAppointmentsByDoctorId', () => {
    it('should return appointments for a doctor', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockService.findByDoctorId.mockResolvedValue(data);

      const result = await controller.getAppointmentsByDoctorId(10);

      expect(result).toBe(data);
      expect(mockService.findByDoctorId).toHaveBeenCalledWith(10);
    });
  });

  describe('getAppointmentsByPatientId', () => {
    it('should return appointments for a patient', async () => {
      const data = [{ id: 3 }];
      mockService.findByPatientId.mockResolvedValue(data);

      const result = await controller.getAppointmentsByPatientId(20);

      expect(result).toBe(data);
      expect(mockService.findByPatientId).toHaveBeenCalledWith(20);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete the appointment', async () => {
      mockService.deleteAppointment.mockResolvedValue('Turno eliminado correctamente');

      const result = await controller.deleteAppointment(99);

      expect(result).toBe('Turno eliminado correctamente');
      expect(mockService.deleteAppointment).toHaveBeenCalledWith(99);
    });
  });

});