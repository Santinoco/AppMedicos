import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from '../locations/locations.controller';
import { LocationService } from '../locations/locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  const mockService = {
    getAllLocations: jest.fn(),
    getLocationById: jest.fn(),
    createLocation: jest.fn(),
    deleteLocation: jest.fn(),
    updateLocation: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);

    jest.clearAllMocks();
  });

  describe('getAllLocations', () => {
    it('should return all locations', async () => {
      const mockLocations = [{ id: 1, nombre: 'Centro' }];
      mockService.getAllLocations.mockResolvedValue(mockLocations);

      const result = await controller.getAllLocations();

      expect(result).toBe(mockLocations);
      expect(mockService.getAllLocations).toHaveBeenCalled();
    });
  });

  describe('getLocationById', () => {
    it('should return the location by id', async () => {
      const mockLocation = { id: 2, nombre: 'Sucursal A' };
      mockService.getLocationById.mockResolvedValue(mockLocation);

      const result = await controller.getLocationById(2);

      expect(result).toBe(mockLocation);
      expect(mockService.getLocationById).toHaveBeenCalledWith(2);
    });
  });

  describe('createLocation', () => {
    it('should create a new location', async () => {
      const dto = { nombre: 'Nueva Sucursal', direccion: 'Av X 1234' };
      const mockLocation = { ...dto, id: 5 };
      mockService.createLocation.mockResolvedValue(mockLocation);

      const result = await controller.createLocation(dto);

      expect(result).toBe(mockLocation);
      expect(mockService.createLocation).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteLocation', () => {
    it('should delete the location', async () => {
      mockService.deleteLocation.mockResolvedValue('Eliminado correctamente');

      const result = await controller.deleteLocation(8);

      expect(result).toBe('Eliminado correctamente');
      expect(mockService.deleteLocation).toHaveBeenCalledWith(8);
    });
  });

  describe('updateLocation', () => {
    it('should update the location', async () => {
      const patch = { nombre: 'Sucursal editada' };
      const updated = { id: 10, ...patch };
      mockService.updateLocation.mockResolvedValue(updated);

      const result = await controller.updateLocation(10, patch);

      expect(result).toBe(updated);
      expect(mockService.updateLocation).toHaveBeenCalledWith(10, patch);
    });
  });

});