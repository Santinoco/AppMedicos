import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from '../../src/calendar/calendar.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Calendar } from '../../src/calendar/entities/calendar.model'; 
import { Appointment } from '../../src/appointments/entities/appointment.model';
import { Doctor } from '../../src/doctors/entities/doctor.model';
import { NotFoundException } from '@nestjs/common';

describe('CalendarService', () => {
  let service: CalendarService;
  let slotRepo: Repository<Calendar>;
  let appointmentRepo: Repository<Appointment>;
  let doctorRepo: Repository<Doctor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        { provide: getRepositoryToken(Calendar), useClass: Repository },
        { provide: getRepositoryToken(Appointment), useClass: Repository },
        { provide: getRepositoryToken(Doctor), useClass: Repository },
      ]
    }).compile();

    service = module.get(CalendarService);
    slotRepo = module.get(getRepositoryToken(Calendar));
    appointmentRepo = module.get(getRepositoryToken(Appointment));
    doctorRepo = module.get(getRepositoryToken(Doctor));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all slots ordered by slot_id', async () => {
    const slots = [
      { slot_id: 1, slot_datetime: new Date() },
      { slot_id: 2, slot_datetime: new Date() },
    ] as Calendar[];
    jest.spyOn(slotRepo, 'find').mockResolvedValue(slots);

    expect(await service.getSlots()).toEqual(slots);
    expect(slotRepo.find).toHaveBeenCalledWith({ order: { slot_id: "ASC" } });
  });

  it('should get appointments for a doctor', async () => {
    const qbMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    };
    jest.spyOn(appointmentRepo, 'createQueryBuilder').mockReturnValue(qbMock as any);

    const result = await service.getAppointmentsForDoctor(5);

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(appointmentRepo.createQueryBuilder).toHaveBeenCalledWith('appointment');
    expect(qbMock.where).toHaveBeenCalledWith('appointment.doctor_id = :doctorUserId', { doctorUserId: 5 });
  });

  it('should throw NotFoundException if doctor does not exist when getting available slots', async () => {
    jest.spyOn(appointmentRepo, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    } as any);

    jest.spyOn(doctorRepo, 'findOne').mockResolvedValue(null);

    await expect(service.getAvailableSlotsForDoctor(888)).rejects.toThrow(NotFoundException);
  });

  it('should get available slots for doctor (shiftStart < shiftEnd)', async () => {
    const slotCalendar1 = { slot_id: 1 };
    const slotCalendar2 = { slot_id: 2 };
    const appointments = [
      { slot_datetime: slotCalendar1 },
      { slot_datetime: slotCalendar2 }
    ];
    jest.spyOn(service, 'getAppointmentsForDoctor').mockResolvedValue(appointments as any);

    const doctor = {
      user_id: 5,
      shift_start: '10:00',
      shift_end: '18:00'
    } as Doctor;
    jest.spyOn(doctorRepo, 'findOne').mockResolvedValue(doctor);

    const getManyMock = jest.fn().mockResolvedValue([ { slot_id: 3 } ]);
    const andWhereMock = jest.fn().mockReturnThis();

    const qbMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: andWhereMock,
      getMany: getManyMock,
    };

    jest.spyOn(slotRepo, 'createQueryBuilder').mockReturnValue(qbMock as any);

    const result = await service.getAvailableSlotsForDoctor(5);

    expect(result).toEqual([ { slot_id: 3 } ]);
    expect(slotRepo.createQueryBuilder).toHaveBeenCalledWith('calendar');
    expect(qbMock.where).toHaveBeenCalledWith('calendar.slot_id NOT IN (:...notIn)', { notIn: [1, 2] });
    expect(andWhereMock).toHaveBeenCalledWith("TO_CHAR(calendar.slot_datetime, 'HH24:MI') BETWEEN :shiftStart AND :shiftEnd", {
      shiftStart: '10:00', shiftEnd: '18:00'
    });
    expect(getManyMock).toHaveBeenCalled();
  });

  it('should generate slots and call upsert', async () => {
    const upsertMock = jest.spyOn(slotRepo, 'upsert').mockResolvedValue({} as any);
  
    const originalDate = global.Date;
  
    jest.spyOn(global, 'Date').mockImplementation(() => new originalDate('2024-01-01T10:00:00.000Z') as any);
  
    await service.generateSlots();
  
    expect(upsertMock).toHaveBeenCalled();
    const [savedSlots, columns] = upsertMock.mock.calls[0];
    expect(Array.isArray(savedSlots)).toBe(true);
    expect(columns).toEqual(['slot_datetime']);
  
    jest.restoreAllMocks();
  });

});