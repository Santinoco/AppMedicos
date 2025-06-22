import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

describe('UserTypeController', () => {
  let controller: UserTypeController;
  let service: UserTypeService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTypeController],
      providers: [
        { provide: UserTypeService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UserTypeController>(UserTypeController);
    service = module.get<UserTypeService>(UserTypeService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with body and return result', async () => {
      const dto = { name: 'Paciente' };
      const created = { id: 1, ...dto };
      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(result).toBe(created);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return result', async () => {
      const tipos = [{ id: 1, name: 'Paciente' }, { id: 2, name: 'Doctor' }];
      mockService.findAll.mockResolvedValue(tipos);

      const result = await controller.findAll();

      expect(result).toBe(tipos);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const data = { id: 3, name: 'Admin' };
      mockService.findOne.mockResolvedValue(data);

      const result = await controller.findOne('3');

      expect(result).toBe(data);
      expect(mockService.findOne).toHaveBeenCalledWith(3);
    });
  });

  describe('update', () => {
    it('should call service.update with id and body', async () => {
      const patch = { name: 'Editado' };
      const updated = { id: 5, ...patch };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('5', patch);

      expect(result).toBe(updated);
      expect(mockService.update).toHaveBeenCalledWith(5, patch);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const resp = { message: 'UserType deleted successfully' };
      mockService.remove.mockResolvedValue(resp);

      const result = await controller.remove('99');

      expect(result).toBe(resp);
      expect(mockService.remove).toHaveBeenCalledWith(99);
    });
  });

});