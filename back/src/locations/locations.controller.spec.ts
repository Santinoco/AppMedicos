import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './locations.controller';
import { LocationService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const mockService = {
      getAllLocations: jest.fn(),
      getLocationById: jest.fn(),
      createLocation: jest.fn(),
      deleteLocation: jest.fn(),
      updateLocation: jest.fn(),
    };
    
    const builder = Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        { provide: LocationService, useValue: mockService },
      ],
    });
    
    builder.overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true });
    builder.overrideGuard(RolesGuard).useValue({ canActivate: () => true });
    
    const module: TestingModule = await builder.compile();
    
    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should return all locations ordered by id', async () => {
    const locations = [
      { location_id: 1, city: 'A', province: 'B', country: 'C' },
      { location_id: 2, city: 'X', province: 'Y', country: 'Z' },
    ];
    (service.getAllLocations as jest.Mock).mockResolvedValue(locations); 

    const result = await controller.getAllLocations();

    expect(result).toEqual(locations);
    expect(service.getAllLocations).toHaveBeenCalled(); 
  });

  it('should return a location by id', async () => {
    const location = { location_id: 1, city: 'A', province: 'B', country: 'C' };
    (service.getLocationById as jest.Mock).mockResolvedValue(location);

    const result = await controller.getLocationById(1);

    expect(result).toEqual(location);
    expect(service.getLocationById).toHaveBeenCalledWith(1);
  });

  it('should create a location', async () => {
    const locationData = { city: 'A', province: 'B', country: 'C' };
    const createdLocation = { location_id: 1, ...locationData };
    (service.createLocation as jest.Mock).mockResolvedValue(createdLocation);

    const result = await controller.createLocation(locationData);

    expect(result).toEqual(createdLocation);
    expect(service.createLocation).toHaveBeenCalledWith(locationData);
  });

  it('should delete a location', async () => {
    const deletedLocation = { message: 'Location deleted successfully' };
    (service.deleteLocation as jest.Mock).mockResolvedValue(deletedLocation);

    const result = await controller.deleteLocation(1);

    expect(result).toEqual(deletedLocation);
    expect(service.deleteLocation).toHaveBeenCalledWith(1);
  })

  it('should update a location', async () => {
    const location = { location_id: 1, city: 'A', province: 'B', country: 'C' };
    const updateData = { city: 'New City' };
    (service.updateLocation as jest.Mock).mockResolvedValue({...location,...updateData });

    const result = await controller.updateLocation(1, updateData);

    expect(result).toEqual({...location,...updateData });
    expect(service.updateLocation).toHaveBeenCalledWith(1, updateData);
  })
});