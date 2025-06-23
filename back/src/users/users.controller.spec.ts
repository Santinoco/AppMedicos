import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller'; 
import { UserService } from './user.service';         
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles/roles.guard';      

describe('UsersController', () => {
  let controller: UsersController;
  let service: UserService;

  beforeEach(async () => {
    const mockService = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserAppoinments: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const builder = Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UserService, useValue: mockService },
      ],
    });

    builder.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true });
    builder.overrideGuard(RolesGuard).useValue({ canActivate: () => true });

    const module = await builder.compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all users', async () => {
    const users = [{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }];
    (service.getAllUsers as jest.Mock).mockResolvedValue(users);

    const result = await controller.getAllUsers();

    expect(result).toEqual(users);
    expect(service.getAllUsers).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const user = { id: 5, nombre: 'Prueba' };
    (service.getUserById as jest.Mock).mockResolvedValue(user);

    const result = await controller.getUserById(5);

    expect(result).toEqual(user);
    expect(service.getUserById).toHaveBeenCalledWith(5);
  });

  it('should return user appointments', async () => {
    const data = { user: { id: 10 }, message: 'msg' };
    (service.getUserAppoinments as jest.Mock).mockResolvedValue(data);

    const result = await controller.getUserAppoinments(10);

    expect(result).toEqual(data);
    expect(service.getUserAppoinments).toHaveBeenCalledWith(10);
  });

  it('should update a user', async () => {
    const userUpdated = { id: 1, nombre: 'NuevoNombre' };
    const patch = { nombre: 'NuevoNombre' };
    (service.updateUser as jest.Mock).mockResolvedValue(userUpdated);

    const result = await controller.updateUser(1, patch);

    expect(result).toEqual(userUpdated);
    expect(service.updateUser).toHaveBeenCalledWith(1, patch);
  });

  it('should delete a user', async () => {
    (service.deleteUser as jest.Mock).mockResolvedValue({ message: 'User deleted succesfully' });

    const result = await controller.deleteUser(12);

    expect(result).toEqual({ message: 'User deleted succesfully' });
    expect(service.deleteUser).toHaveBeenCalledWith(12);
  });
});