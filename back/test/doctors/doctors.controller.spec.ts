import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsController } from '../../src/doctors/doctors.controller';      
import { DoctorsService } from '../../src/doctors/doctors.service';           
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';  
import { RolesGuard } from '../../src/auth/roles/roles.guard';        

describe('DoctorsController', () => {
  let controller: DoctorsController;
  let service: DoctorsService;

  beforeEach(async () => {
    const mockService = {
      getAllDoctors: jest.fn(),
      getDoctorById: jest.fn(),
      createDoctor: jest.fn(),
      updateDoctor: jest.fn(),
      deleteDoctor: jest.fn(),
    };

    const builder = Test.createTestingModule({
      controllers: [DoctorsController],
      providers: [{ provide: DoctorsService, useValue: mockService }],
    });

    builder.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true });
    builder.overrideGuard(RolesGuard).useValue({ canActivate: () => true });

    const module: TestingModule = await builder.compile();

    controller = module.get<DoctorsController>(DoctorsController);
    service = module.get<DoctorsService>(DoctorsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all doctors', async () => {
    const doctors = [{ user_id: 1, specialty: 'Cardio' }, { user_id: 2, specialty: 'Pedia' }];
    (service.getAllDoctors as jest.Mock).mockResolvedValue(doctors);

    const result = await controller.getAllDoctors();

    expect(result).toEqual(doctors);
    expect(service.getAllDoctors).toHaveBeenCalled();
  });

  it('should return a doctor by user_id', async () => {
    const doctor = { user_id: 7, specialty: 'Neuro' };
    (service.getDoctorById as jest.Mock).mockResolvedValue(doctor);

    const result = await controller.getDoctorById(7);

    expect(result).toEqual(doctor);
    expect(service.getDoctorById).toHaveBeenCalledWith(7);
  });

  it('should create a doctor', async () => {
    const doctorData = { user_id: 21, specialty: 'Clinic' };
    const created = { ...doctorData, active: true };
    (service.createDoctor as jest.Mock).mockResolvedValue(created);

    const result = await controller.createDoctor(doctorData);

    expect(result).toEqual(created);
    expect(service.createDoctor).toHaveBeenCalledWith(doctorData);
  });

  it('should update a doctor', async () => {
    const updated = { user_id: 11, specialty: 'Trauma', license_number: 123 };
    const updateData = { license_number: 123 };
    (service.updateDoctor as jest.Mock).mockResolvedValue(updated);

    const result = await controller.updateDoctor(11, updateData);

    expect(result).toEqual(updated);
    expect(service.updateDoctor).toHaveBeenCalledWith(11, updateData);
  });

  it('should delete a doctor', async () => {
    (service.deleteDoctor as jest.Mock).mockResolvedValue({ message: "Doctor and related appointments deleted successfully" });

    const result = await controller.deleteDoctor(19);

    expect(result).toEqual({ message: "Doctor and related appointments deleted successfully" });
    expect(service.deleteDoctor).toHaveBeenCalledWith(19);
  });
});