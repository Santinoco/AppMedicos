import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.model';
import { Calendar } from '../calendar/entities/calendar.model';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

// Helper factory para mockear el repositorio TypeORM
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

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
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepo = module.get(getRepositoryToken(Appointment));
    calendarRepo = module.get(getRepositoryToken(Calendar));

    // @ts-ignore
    service.appointmentRepository = appointmentRepo;
    // @ts-ignore
    service.calendarRepository = calendarRepo;

    jest.clearAllMocks();
  });

  describe('getAllAppointments', () => {
    it('should find all appointments with relations', async () => {
      const expected = [{ id: 1 }];
      appointmentRepo.find.mockResolvedValue(expected);

      const result = await service.getAllAppointments();

      expect(appointmentRepo.find).toHaveBeenCalledWith({
        relations: [
          'patient_id',
          'patient.user',
          'doctor_id',
          'doctor.user',
          'status',
          'slot_datetime',
        ],
        order: { id: "ASC" }
      });
      expect(result).toBe(expected);
    });
  });

  describe('getAppointmentById', () => {
    it('should find appointment by id with relations', async () => {
      const appointment = { id: 22 };
      appointmentRepo.findOne.mockResolvedValue(appointment);

      const result = await service.getAppointmentById(22);

      expect(appointmentRepo.findOne).toHaveBeenCalledWith({
        relations: [
          'patient_id',
          'patient.user',
          'doctor_id',
          'doctor.user',
          'status',
          'slot_datetime',
        ],
        where: { id: 22 }
      });
      expect(result).toBe(appointment);
    });
  });

  describe('createAppointment', () => {
    const dto = { motivo: 'Consulta', slot_datetime: '2024-06-01T10:00:00Z', doctor_id: 1, patient_id: 2 };

    it('should create appointment when slot exists', async () => {
      const fakeSlot = { id: 10 };
      const appCreated = { ...dto, slot_datetime: fakeSlot };
      const appSaved = { ...appCreated, id: 1 };

      calendarRepo.findOne.mockResolvedValue(fakeSlot);
      appointmentRepo.create.mockReturnValue(appCreated);
      appointmentRepo.save.mockResolvedValue(appSaved);

      const result = await service.createAppointment(dto as any);

      expect(calendarRepo.findOne).toHaveBeenCalledWith({ where: { slot_datetime: dto.slot_datetime } });
      expect(appointmentRepo.create).toHaveBeenCalledWith({
        motivo: dto.motivo,
        slot_datetime: fakeSlot,
        doctor_id: dto.doctor_id,
        patient_id: dto.patient_id,
      });
      expect(appointmentRepo.save).toHaveBeenCalledWith(appCreated);
      expect(result).toBe(appSaved);
    });

    it('should throw NotFoundException if slot does not exist', async () => {
      calendarRepo.findOne.mockResolvedValue(null);
      await expect(service.createAppointment(dto as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAppointmentStatus', () => {
    it('should update appointment status and return appointment', async () => {
      appointmentRepo.update.mockResolvedValue(undefined);
      const found = { id: 99, estado_id: 3 };
      jest.spyOn(service, 'getAppointmentById').mockResolvedValue(found as any);

      const result = await service.updateAppointmentStatus(99, 3);

      expect(appointmentRepo.update).toHaveBeenCalledWith(99, { estado_id: 3 });
      expect(service.getAppointmentById).toHaveBeenCalledWith(99);
      expect(result).toBe(found);
    });
  });

  describe('findByDoctorId', () => {
    it('should find appointments by doctor id', async () => {
      const appointments = [{ id: 5 }];
      appointmentRepo.find.mockResolvedValue(appointments);

      const doctorUserId = 15;
      const result = await service.findByDoctorId(doctorUserId);

      expect(appointmentRepo.find).toHaveBeenCalledWith({
        where: { doctor: { user_id: doctorUserId } },
        relations: [
          'doctor', 'doctor.user', 'patient', 'patient.user', 'status',
        ],
        order: { id: 'ASC' }
      });
      expect(result).toBe(appointments);
    });
  });

  describe('findByPatientId', () => {
    it('should find appointments by patient id', async () => {
      const appointments = [{ id: 6 }];
      appointmentRepo.find.mockResolvedValue(appointments);

      const patientUserId = 17;
      const result = await service.findByPatientId(patientUserId);

      expect(appointmentRepo.find).toHaveBeenCalledWith({
        where: { patient: { user_id: patientUserId } },
        relations: [
          'doctor', 'doctor.user', 'patient', 'patient.user', 'status',
        ],
        order: { id: 'ASC' }
      });
      expect(result).toBe(appointments);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete appointment if exists', async () => {
      const existing = { id: 77 };
      appointmentRepo.findOne.mockResolvedValue(existing);
      appointmentRepo.remove.mockResolvedValue(undefined);

      const res = await service.deleteAppointment(77);

      expect(appointmentRepo.findOne).toHaveBeenCalledWith({ where: { id: 77 } });
      expect(appointmentRepo.remove).toHaveBeenCalledWith(existing);
      expect(res).toBe("Turno eliminado correctamente");
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      appointmentRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteAppointment(77)).rejects.toThrow(NotFoundException);
    });
  });
});