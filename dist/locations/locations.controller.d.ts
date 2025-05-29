import { LocationService } from "./locations.service";
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    getAllLocations(): Promise<import("./entities/location.model").Location[]>;
    getLocationById(location_id: number): Promise<import("./entities/location.model").Location | null>;
    createLocation(locationData: any): Promise<import("./entities/location.model").Location[]>;
}
