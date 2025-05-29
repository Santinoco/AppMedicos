import { Repository } from "typeorm";
import { Location } from "./entities/location.model";
export declare class LocationService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    getAllLocations(): Promise<Location[]>;
    getLocationById(location_id: number): Promise<Location | null>;
    createLocation(locationData: any): Promise<Location[]>;
}
