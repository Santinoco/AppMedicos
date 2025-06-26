import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RegisterAuthDto } from '../../src/auth/dto/register-auth.dto';
import { LoginAuthDto } from '../../src/auth/dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register with DTO and return result', async () => {
      const dto: RegisterAuthDto = {
        nombre: 'Juan', apellido: 'Test', email: 'juan@mail.com', password: 'p', type: 'Paciente'
      };
      const result = { user: { id: 1 }, access_token: 'tok' };
      mockService.register.mockResolvedValue(result);

      const response = await controller.register(dto);

      expect(response).toBe(result);
      expect(mockService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with DTO and return result', async () => {
      const dto: LoginAuthDto = { email: 'prueba@mail', password: 'clave' };
      const result = { user: { id: 1 }, access_token: 'tok' };
      mockService.login.mockResolvedValue(result);

      const response = await controller.login(dto);

      expect(response).toBe(result);
      expect(mockService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProfile', () => {
    it('should return req.user', async () => {
      const mockUser = { id: 55, email: 'test@mail.com', nombre: 'Lu' };
      const req = { user: mockUser };

      const profile = controller.getProfile(req);

      expect(profile).toBe(mockUser);
    });
  });
});