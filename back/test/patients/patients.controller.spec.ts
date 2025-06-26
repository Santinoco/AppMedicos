import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from '../../src/patients/patients.controller';   
import { PatientService } from '../../src/patients/patients.service';         
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../../src/auth/roles/roles.guard';       

describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;

  beforeEach(async () => {
    const mockService = {
      getAllPatients: jest.fn(),
      getPatientById: jest.fn(),
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
    };

    const builder = Test.createTestingModule({
      controllers: [PatientController],
      providers: [{ provide: PatientService, useValue: mockService }]
    });

    builder.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true });
    builder.overrideGuard(RolesGuard).useValue({ canActivate: () => true });

    const module: TestingModule = await builder.compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all patients', async () => {
    const patients = [{ user_id: 1, blood_type: 'A+' }, { user_id: 2, blood_type: 'B-' }];
    (service.getAllPatients as jest.Mock).mockResolvedValue(patients);

    const result = await controller.getAllPatients();

    expect(result).toEqual(patients);
    expect(service.getAllPatients).toHaveBeenCalled();
  });

  it('should return a patient by user_id', async () => {
    const patient = { user_id: 5, blood_type: 'AB-' };
    (service.getPatientById as jest.Mock).mockResolvedValue(patient);

    const result = await controller.getPatientById(5);

    expect(result).toEqual(patient);
    expect(service.getPatientById).toHaveBeenCalledWith(5);
  });

  it('should create a patient', async () => {
    const patientData = { user_id: 44, blood_type: "O+" };
    const created = { user_id: 44, blood_type: "O+" };

    (service.createPatient as jest.Mock).mockResolvedValue(created);

    const result = await controller.createPatient(patientData);

    expect(result).toEqual(created);
    expect(service.createPatient).toHaveBeenCalledWith(patientData);
  });

  it('should update a patient', async () => {
    const updated = { user_id: 15, blood_type: 'B+', completed_consultations: 10 };
    const updateData = { completed_consultations: 10 };

    (service.updatePatient as jest.Mock).mockResolvedValue(updated);

    const result = await controller.updatePatient(15, updateData);

    expect(result).toEqual(updated);
    expect(service.updatePatient).toHaveBeenCalledWith(15, updateData);
  });

  it('should delete a patient', async () => {
    (service.deletePatient as jest.Mock).mockResolvedValue({ message: 'Patient and related appointments deleted successfully' });

    const result = await controller.deletePatient(22);

    expect(result).toEqual({ message: 'Patient and related appointments deleted successfully' });
    expect(service.deletePatient).toHaveBeenCalledWith(22);
  });
});