import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from '../../src/patients/patients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../src/patients/entities/patient.model';      
import { Appointment } from '../../src/appointments/entities/appointment.model'; 
import { NotFoundException } from '@nestjs/common';

describe('PatientService', () => {
  let service: PatientService;
  let patientRepo: Repository<Patient>;
  let appointmentRepo: Repository<Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        { provide: getRepositoryToken(Patient), useClass: Repository },
        { provide: getRepositoryToken(Appointment), useClass: Repository },
      ],
    }).compile();

    service = module.get(PatientService);
    patientRepo = module.get(getRepositoryToken(Patient));
    appointmentRepo = module.get(getRepositoryToken(Appointment));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all patients ordered by user_id and with user relation', async () => {
    const patients = [
      { user_id: 1, user: { nombre: 'A' } },
      { user_id: 2, user: { nombre: 'B' } },
    ];
    jest.spyOn(patientRepo, 'find').mockResolvedValue(patients as any);

    const result = await service.getAllPatients();
    expect(result).toEqual(patients);
    expect(patientRepo.find).toHaveBeenCalledWith({ relations: ["user"], order: { user_id: "ASC" } });
  });

  it('should return a patient by user_id', async () => {
    const patient = { user_id: 7, user: { nombre: 'Carlos' } } as Patient;
    jest.spyOn(patientRepo, 'findOne').mockResolvedValue(patient);

    const result = await service.getPatientById(7);
    expect(result).toEqual(patient);
    expect(patientRepo.findOne).toHaveBeenCalledWith({
      where: { user_id: 7 },
      relations: ["user"],
    });
  });

  it('should create a patient', async () => {
    const patientData = { user_id: 55, blood_type: "B+" };
    const createdPatient = { user_id: 55, blood_type: "B+" };
    jest.spyOn(patientRepo, 'create').mockReturnValue(createdPatient as any);
    jest.spyOn(patientRepo, 'save').mockResolvedValue(createdPatient as any);

    const result = await service.createPatient(patientData);
    expect(result).toEqual(createdPatient);
    expect(patientRepo.create).toHaveBeenCalledWith(patientData);
    expect(patientRepo.save).toHaveBeenCalledWith(createdPatient);
  });

  it('should update an existing patient', async () => {
    const patient = { user_id: 23, completed_consultations: 1 } as Patient;
    const update = { completed_consultations: 4 };
    jest.spyOn(patientRepo, 'findOne').mockResolvedValue(patient);
    jest.spyOn(patientRepo, 'save').mockResolvedValue({ ...patient, ...update });

    const result = await service.updatePatient(23, update);
    expect(result).toEqual({ ...patient, ...update });
    expect(patientRepo.save).toHaveBeenCalledWith({ ...patient, ...update });
  });

  it('should delete patient and related appointments', async () => {
    const patient = { user_id: 123 } as Patient;
    jest.spyOn(patientRepo, 'findOne').mockResolvedValue(patient);
    const spyDeleteAppointments = jest.spyOn(appointmentRepo, 'delete').mockResolvedValue({} as any);
    const spyDeletePatient = jest.spyOn(patientRepo, 'delete').mockResolvedValue({} as any);

    const result = await service.deletePatient(123);

    expect(spyDeleteAppointments).toHaveBeenCalledWith({ patient: { user_id: 123 } });
    expect(spyDeletePatient).toHaveBeenCalledWith({ user_id: 123 });
    expect(result).toEqual({ message: "Patient and related appointments deleted successfully" });
  });
});