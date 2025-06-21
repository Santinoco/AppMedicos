import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './entities/location.model';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('LocationService', () => {
  let service: LocationService;
  let repo: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repo = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all locations ordered by id', async () => {
    const locations = [
      { location_id: 1, city: 'A', province: 'B', country: 'C' },
      { location_id: 2, city: 'X', province: 'Y', country: 'Z' },
    ];
    jest.spyOn(repo, 'find').mockResolvedValue(locations as Location[]);
    expect(await service.getAllLocations()).toEqual(locations);
  });

  it('should return a location by id', async () => {
    const location = { location_id: 1, city: 'A', province: 'B', country: 'C' } as Location;
    jest.spyOn(repo, 'findOne').mockResolvedValue(location);
    expect(await service.getLocationById(1)).toEqual(location);
  });

  it('should create a location', async () => {
    const locationData = { city: 'A', province: 'B', country: 'C' };
    const location = { location_id: 1, ...locationData } as Location;
    jest.spyOn(repo, 'create').mockReturnValue(location);
    jest.spyOn(repo, 'save').mockResolvedValue(location);
    expect(await service.createLocation(locationData)).toEqual(location);
  });

  it('should delete a location', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);
    expect(await service.deleteLocation(1)).toEqual({ message: 'Location deleted successfully' });
  });

  it('should throw NotFoundException when deleting non-existent location', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as any);
    await expect(service.deleteLocation(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a location', async () => {
    const location = { location_id: 1, city: 'A', province: 'B', country: 'C' } as Location;
    const updateData = { city: 'New City' };
    jest.spyOn(repo, 'findOne').mockResolvedValue(location);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...location, ...updateData });
    expect(await service.updateLocation(1, updateData)).toEqual({ ...location, ...updateData });
  });

  it('should throw NotFoundException when updating non-existent location', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null); 
    await expect(service.updateLocation(1, { city: 'X' })).rejects.toThrow(NotFoundException);
  });
});
