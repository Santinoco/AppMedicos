import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "./entities/location.model";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async getAllLocations() {
    return this.locationRepository.find();
  }

  async getLocationById(location_id: number) {
    return this.locationRepository.findOne({ where: { location_id } });
  }

  async createLocation(locationData: any) {
    const location = this.locationRepository.create(locationData);
    return this.locationRepository.save(location);
  }

  async deleteLocation(location_id: number) {
    const result = await this.locationRepository.delete({ location_id });
    if (result.affected === 0) {
      throw new NotFoundException(`Location with id ${location_id} not found`);
    }
    return { message: "Location deleted successfully" };
  }

  async updateLocation(location_id: number, updateData: any) {
    const location = await this.locationRepository.findOne({ where: { location_id } });
    if (!location) throw new NotFoundException('Location not found');
    Object.assign(location, updateData);
    return this.locationRepository.save(location);
  }

}