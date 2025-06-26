import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from '../../src/user-type/entities/user-type.model'; 
import { UserService } from '../../src/users/user.service'; 
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockRepository = () => ({
  findOne: jest.fn(),
});
const mockUserService = {
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  findByEmailWithType: jest.fn(),
};
const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userTypeRepo: ReturnType<typeof mockRepository>;
  let usersService: typeof mockUserService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserType), useFactory: mockRepository },
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userTypeRepo = module.get(getRepositoryToken(UserType));
    usersService = module.get(UserService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = { 
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com',
      password: '1234',
      type: 'Paciente'
    };

    it('should throw if user exists', async () => {
      usersService.getAllUsers.mockResolvedValue([{ email: dto.email }]);
      await expect(service.register(dto as any)).rejects.toThrow(ConflictException);
      expect(usersService.getAllUsers).toHaveBeenCalled();
    });

    it('should throw if user type is invalid', async () => {
      usersService.getAllUsers.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('HASHEDPASS');
      userTypeRepo.findOne.mockResolvedValue(null);

      await expect(service.register(dto as any)).rejects.toThrow(BadRequestException);
      expect(userTypeRepo.findOne).toHaveBeenCalledWith({ where: { name: dto.type } });
    });

    it('should register a new user and return tokens', async () => {
      usersService.getAllUsers.mockResolvedValue([]);
      (bcrypt.hash as jest.Mock).mockResolvedValue('HASHEDPASS');
      userTypeRepo.findOne.mockResolvedValue({ id: 1, name: 'Paciente' });

      const createdUser = {
        id: 10,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        type: { id: 1, name: 'Paciente' }
      };
      usersService.createUser.mockResolvedValue(createdUser);
      jwtService.sign.mockResolvedValue('TOKEN');

      const result = await service.register(dto as any);

      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...dto,
        password: 'HASHEDPASS',
        type: { id: 1, name: 'Paciente' }
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: createdUser.email,
        sub: createdUser.id,
        role: createdUser.type.name
      });
      expect(result).toEqual({
        user: {
          id: createdUser.id,
          nombre: createdUser.nombre,
          apellido: createdUser.apellido,
          email: createdUser.email,
          type: createdUser.type
        },
        access_token: 'TOKEN'
      });
    });
  });

  describe('login', () => {
    const dto = { email: 'alguien@mail.com', password: 'clave' };

    it('should throw Unauthorized if user not found', async () => {
      usersService.findByEmailWithType.mockResolvedValue(null);

      await expect(service.login(dto as any)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmailWithType).toHaveBeenCalledWith(dto.email);
    });

    it('should throw Unauthorized if password is invalid', async () => {
      const fakeUser = {
        id: 1,
        email: dto.email,
        password: 'passwordEncriptada',
        nombre: 'Nom',
        apellido: 'Ape',
        type: { name: 'Paciente' }
      };
      usersService.findByEmailWithType.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto as any)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, fakeUser.password);
    });

    it('should login and return token if credentials are valid', async () => {
      const fakeUser = {
        id: 1,
        email: dto.email,
        password: 'passwordEncriptada',
        nombre: 'Nom',
        apellido: 'Ape',
        type: { name: 'Paciente' }
      };
      usersService.findByEmailWithType.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockResolvedValue('JWT123');

      const result = await service.login(dto as any);

      expect(result).toEqual({
        user: {
          id: fakeUser.id,
          nombre: fakeUser.nombre,
          apellido: fakeUser.apellido,
          email: fakeUser.email,
          type: fakeUser.type
        },
        access_token: 'JWT123'
      });
      expect(usersService.findByEmailWithType).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, fakeUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: fakeUser.email,
        sub: fakeUser.id,
        role: fakeUser.type.name
      });
    });
  });

});