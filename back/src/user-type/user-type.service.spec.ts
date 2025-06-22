import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserTypeService } from './user-type.service';
import { UserType } from './entities/user-type.model';
import { Repository, DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UserTypeService', () => {
  let service: UserTypeService;
  let repo: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTypeService,
        { provide: getRepositoryToken(UserType), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UserTypeService>(UserTypeService);
    repo = module.get(getRepositoryToken(UserType));

    // @ts-ignore
    service.userTypeRepository = repo;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user type', async () => {
      const dto = { name: 'Paciente' };
      const created = { ...dto };
      const saved = { id: 1, ...dto };

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('should return all user types', async () => {
      const data = [
        { id: 1, name: 'Paciente' },
        { id: 2, name: 'Doctor' }
      ];
      repo.find.mockResolvedValue(data);

      const result = await service.findAll();

      expect(result).toBe(data);
      expect(repo.find).toHaveBeenCalledWith({ order: { id: "ASC" }});
    });
  });

  describe('findOne', () => {
    it('should return user type by id', async () => {
      const data = { id: 3, name: 'Admin' };
      repo.findOne.mockResolvedValue(data);

      const result = await service.findOne(3);

      expect(result).toBe(data);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 3 }});
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return user type', async () => {
      repo.update.mockResolvedValue(undefined);

      const updated = { id: 5, name: 'Editado' };
      jest.spyOn(service, 'findOne').mockResolvedValue(updated as any);

      const result = await service.update(5, { name: 'Editado' });
      expect(repo.update).toHaveBeenCalledWith(5, { name: 'Editado' });
      expect(service.findOne).toHaveBeenCalledWith(5);
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('should delete user type if exists', async () => {
      const deleteResult = { affected: 1 } as DeleteResult;
      repo.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(7);

      expect(repo.delete).toHaveBeenCalledWith(7);
      expect(result).toEqual({ message: "UserType deleted successfully" });
    });

    it('should throw NotFoundException if not found', async () => {
      const deleteResult = { affected: 0 } as DeleteResult;
      repo.delete.mockResolvedValue(deleteResult);

      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });

});