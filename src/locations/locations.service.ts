import { Injectable } from "@nestjs/common";
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
}