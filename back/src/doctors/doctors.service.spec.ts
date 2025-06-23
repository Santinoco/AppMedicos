import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.model'; 
import { Appointment } from '../appointments/entities/appointment.model'; 
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let doctorRepo: Repository<Doctor>;
  let appointmentRepo: Repository<Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        { provide: getRepositoryToken(Doctor), useClass: Repository },
        { provide: getRepositoryToken(Appointment), useClass: Repository }
      ]
    }).compile();

    service = module.get(DoctorsService);
    doctorRepo = module.get(getRepositoryToken(Doctor));
    appointmentRepo = module.get(getRepositoryToken(Appointment));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all doctors ordered by user_id and with user relation', async () => {
    const doctors = [
      { user_id: 1, specialty: 'Cardiology', user: { nombre: 'D1' } },
      { user_id: 2, specialty: 'Neuro', user: { nombre: 'D2' } },
    ];
    jest.spyOn(doctorRepo, 'find').mockResolvedValue(doctors as any);

    const result = await service.getAllDoctors();

    expect(result).toEqual(doctors);
    expect(doctorRepo.find).toHaveBeenCalledWith({ relations: ["user"], order: { user_id: "ASC" } });
  });

  it('should return a doctor by user_id', async () => {
    const doctor = { user_id: 3, specialty: 'Trauma', user: { nombre: 'D3' } } as Doctor;
    jest.spyOn(doctorRepo, 'findOne').mockResolvedValue(doctor);

    const result = await service.getDoctorById(3);

    expect(result).toEqual(doctor);
    expect(doctorRepo.findOne).toHaveBeenCalledWith({
      where: { user_id: 3 },
      relations: ["user"],
    });
  });

  it('should create a doctor', async () => {
    const docData = { user_id: 77, specialty: 'Pediatrics' };
    const mockDoctor = { ...docData, user: { nombre: 'X' } };
    jest.spyOn(doctorRepo, 'create').mockReturnValue(mockDoctor as any);
    jest.spyOn(doctorRepo, 'save').mockResolvedValue(mockDoctor as any);

    const result = await service.createDoctor(docData);

    expect(result).toEqual(mockDoctor);
    expect(doctorRepo.create).toHaveBeenCalledWith(docData);
    expect(doctorRepo.save).toHaveBeenCalledWith(mockDoctor);
  });

  it('should update an existing doctor', async () => {
    const doctor = {
      user_id: 12, specialty: 'Old', getShiftStart: () => '', setShiftStart: () => {},
      getShiftEnd: () => '', setShiftEnd: () => {}, shift_start: '', shift_end: '',
      license_number: 123, active: true, appointments: [], user: {} as any
    } as Doctor;
    const update = { specialty: 'New Specialty' };
    jest.spyOn(doctorRepo, 'findOne').mockResolvedValue(doctor as Doctor);
    jest.spyOn(doctorRepo, 'save').mockResolvedValue({ ...doctor, ...update } as Doctor);

    const result = await service.updateDoctor(12, update);

    expect(result).toEqual({ ...doctor, ...update });
    expect(doctorRepo.save).toHaveBeenCalledWith({ ...doctor, ...update });
  });

  it('should delete doctor and related appointments', async () => {
    jest.spyOn(appointmentRepo, 'delete').mockResolvedValue({} as any);
    jest.spyOn(doctorRepo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteDoctor(44);

    expect(appointmentRepo.delete).toHaveBeenCalledWith({ doctor_id: 44 });
    expect(doctorRepo.delete).toHaveBeenCalledWith({ user_id: 44 });
    expect(result).toEqual({ message: 'Doctor and related appointments deleted successfully' });
  });
});