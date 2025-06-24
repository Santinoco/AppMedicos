import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.model'; 
import { DoctorsService } from '../doctors/doctors.service';
import { PatientService } from '../patients/patients.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserType } from 'src/user-type/entities/user-type.model';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let doctorService: DoctorsService;
  let patientService: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: DoctorsService,
          useValue: { createDoctor: jest.fn() },
        },
        {
          provide: PatientService,
          useValue: { createPatient: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    doctorService = module.get<DoctorsService>(DoctorsService);
    patientService = module.get<PatientService>(PatientService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users ordered by id', async () => {
    const users = [{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }];
    jest.spyOn(repo, 'find').mockResolvedValue(users as any);

    expect(await service.getAllUsers()).toEqual(users);
    expect(repo.find).toHaveBeenCalledWith({ order: { id: "ASC" } });
  });

  it('should get a user by id', async () => {
    const user = { id: 1, nombre: 'Hugo' } as User;
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    expect(await service.getUserById(1)).toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a user and create a doctor if type 2', async () => {
    const userType: UserType = { id: 2, name: 'doctor', users: [] };
    const userData = { nombre: 'A', apellido: "B", email: 'a@a.com', password: '123', activo: true, type: userType };
    const userEntity = { id: 5, ...userData } as User;

    jest.spyOn(repo, 'create').mockReturnValue(userEntity);
    jest.spyOn(repo, 'save').mockResolvedValue(userEntity);

    (doctorService.createDoctor as jest.Mock).mockResolvedValue({});

    const result = await service.createUser(userData);

    expect(result).toEqual(userEntity);
    expect(doctorService.createDoctor).toHaveBeenCalledWith({ user_id: userEntity.id });
    expect(patientService.createPatient).not.toHaveBeenCalled();
  });

  it('should create a user and create a patient if type 5', async () => {
    const userType: UserType = { id: 5, name: 'patient', users: [] };
    const userData = { nombre: 'A', apellido: "B", email: 'a@a.com', password: '123', activo: true, type: userType };
    const userEntity = { id: 17, ...userData } as User;

    jest.spyOn(repo, 'create').mockReturnValue(userEntity);
    jest.spyOn(repo, 'save').mockResolvedValue(userEntity);

    (patientService.createPatient as jest.Mock).mockResolvedValue({});

    const result = await service.createUser(userData);

    expect(result).toEqual(userEntity);
    expect(doctorService.createDoctor).not.toHaveBeenCalled();
    expect(patientService.createPatient).toHaveBeenCalledWith({ user_id: userEntity.id });
  });

  /*it('should create a user and not call doctor nor patient for other types', async () => {
    const userData = { nombre: 'B', email: 'b@b.com', password: '456', type: { id: 3 } };
    const userEntity = { id: 3, ...userData } as User;

    jest.spyOn(repo, 'create').mockReturnValue(userEntity);
    jest.spyOn(repo, 'save').mockResolvedValue(userEntity);

    const result = await service.createUser(userData);

    expect(result).toEqual(userEntity);
    expect(doctorService.createDoctor).not.toHaveBeenCalled();
    expect(patientService.createPatient).not.toHaveBeenCalled();
  });*/

  it('should get user appointments', async () => {
    const appointments = [{}, {}];
    const user = { id: 1, appointments } as any;
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    expect(await service.getUserAppoinments(1)).toEqual({
      user,
      message: `Citas del usuario con id: 1`,
    });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ["appointments"],
    });
  });

  it('should update existing user', async () => {
    const user = { id: 1, nombre: 'Sergio', apellido: 'Perez', email: 's@p.com', password: '123', activo: true } as User;
    const updateData = { nombre: 'Checo' };

    jest.spyOn(repo, 'findOne').mockResolvedValue(user);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...user, ...updateData });

    const result = await service.updateUser(1, updateData);

    expect(result).toEqual({ ...user, ...updateData });
    expect(repo.save).toHaveBeenCalledWith({ ...user, ...updateData });
  });

  it('should delete user', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteUser(1);
    expect(result).toEqual({ message: 'User deleted succesfully' });
    expect(repo.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should find by email with type relation', async () => {
    const user = { id: 2, email: 'x@y.com', type: { id: 3 } } as User;
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    expect(await service.findByEmailWithType('x@y.com')).toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: 'x@y.com' },
      relations: ['type'],
    });
  });
});