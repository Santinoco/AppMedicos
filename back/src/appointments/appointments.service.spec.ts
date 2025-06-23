import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.model';
import { Calendar } from '../calendar/entities/calendar.model';
import { CalendarService } from '../calendar/calendar.service';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
});
const mockCalendarService = {};

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepo: ReturnType<typeof mockRepository>;
  let calendarRepo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useFactory: mockRepository },
        { provide: getRepositoryToken(Calendar), useFactory: mockRepository },
        { provide: CalendarService, useValue: mockCalendarService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepo = module.get(getRepositoryToken(Appointment));
    calendarRepo = module.get(getRepositoryToken(Calendar));
    // @ts-ignore
    service.appointmentRepository = appointmentRepo;
    // @ts-ignore
    service.calendarRepository = calendarRepo;
  });

  afterEach(() => jest.clearAllMocks());

  
  describe('getAllAppointments', () => {
    it('should return all appointments', async () => {
      const expected = [{ id: 1 }];
      appointmentRepo.find.mockResolvedValue(expected);
      const result = await service.getAllAppointments();
      expect(result).toBe(expected);
    });
  });

  
  describe('getAppointmentById', () => {
    it('should return an appointment by id if exists', async () => {
      const expected = { id: 4 };
      appointmentRepo.findOne.mockResolvedValue(expected);
      const result = await service.getAppointmentById(4);
      expect(result).toBe(expected);
    });
  });

  
  describe('createAppointment', () => {
    const dto = { motivo: 'Test', slot_datetime: '2024-07-01', doctor_id: 2, patient_id: 9 };

    it('should create and return appointment', async () => {
      const slot = { id: 5 };
      const created = { ...dto, slot_datetime: slot };
      const saved = { ...created, id: 88 };

      calendarRepo.findOne.mockResolvedValue(slot);
      appointmentRepo.create.mockReturnValue(created);
      appointmentRepo.save.mockResolvedValue(saved);

      const result = await service.createAppointment(dto as any);
      expect(result).toBe(saved);
      expect(calendarRepo.findOne).toHaveBeenCalledWith({ where: { slot_datetime: dto.slot_datetime } });
      expect(appointmentRepo.create).toHaveBeenCalledWith({
        motivo: dto.motivo,
        slot_datetime: slot,
        doctor_id: dto.doctor_id,
        patient_id: dto.patient_id,
      });
      expect(appointmentRepo.save).toHaveBeenCalledWith(created);
    });
  });

  
  describe('updateAppointmentStatus', () => {
    it('should update and return appointment', async () => {
      appointmentRepo.update.mockResolvedValue(undefined);
      jest.spyOn(service, 'getAppointmentById').mockResolvedValue({ id: 9, estado_id: 5 } as any);

      const result = await service.updateAppointmentStatus(9, 5);
      expect(result).toEqual({ id: 9, estado_id: 5 });
      expect(appointmentRepo.update).toHaveBeenCalledWith(9, { estado_id: 5 });
      expect(service.getAppointmentById).toHaveBeenCalledWith(9);
    });
  });

  
  describe('findByDoctorId', () => {
    it('should return appointments for doctor', async () => {
      const data = [{ id: 1 }];
      appointmentRepo.find.mockResolvedValue(data);
      const result = await service.findByDoctorId(5);
      expect(result).toBe(data);
      expect(appointmentRepo.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { doctor: { user_id: 5 } }
      }));
    });
  });

  
  describe('findByPatientId', () => {
    it('should return appointments for patient', async () => {
      const data = [{ id: 1 }];
      appointmentRepo.find.mockResolvedValue(data);
      const result = await service.findByPatientId(2);
      expect(result).toBe(data);
      expect(appointmentRepo.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { patient: { user_id: 2 } }
      }));
    });
  });

  
  describe('deleteAppointment', () => {
    it('should remove if appointment exists', async () => {
      const fake = { id: 9 };
      appointmentRepo.findOne.mockResolvedValue(fake);
      appointmentRepo.remove.mockResolvedValue(undefined);

      const result = await service.deleteAppointment(9);
      expect(result).toBe('Turno eliminado correctamente');
      expect(appointmentRepo.findOne).toHaveBeenCalledWith({ where: { id: 9 } });
      expect(appointmentRepo.remove).toHaveBeenCalledWith(fake);
    });
  });

  
  describe('getAppointmentsByPatientName', () => {
    it('should return appointments for a patient name', async () => {
      const data = [{ id: 1 }];
      appointmentRepo.find.mockResolvedValue(data);
      const result = await service.getAppointmentsByPatientName('Pepe');
      expect(result).toBe(data);
      expect(appointmentRepo.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { patient: { user: { nombre: 'Pepe' } } }
      }));
    });
  });

  
  describe('getAppointmentsByDate', () => {
    it('should search between dates (date as string)', async () => {
      const data = [];
      const date = new Date('2024-07-02T00:00:00Z');
      appointmentRepo.find.mockResolvedValue(data);

      const result = await service.getAppointmentsByDate(date);
      expect(result).toBe(data);

      const call = appointmentRepo.find.mock.calls[0][0];
      expect(call.where.slot_datetime.slot_datetime.constructor.name).toBe('FindOperator');
      expect(call.where.slot_datetime.slot_datetime.type).toBe('between');
    });

    it('should search between dates (date as Date)', async () => {
      const data = [];
      appointmentRepo.find.mockResolvedValue(data);
      const date = new Date('2024-07-03T00:00:00Z');

      const result = await service.getAppointmentsByDate(date);
      expect(result).toBe(data);
    });

  });

});