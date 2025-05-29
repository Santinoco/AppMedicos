import { LocationService } from "./locations.service";
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    getAllLocations(): Promise<import("./entities/location.model").Location[]>;
    getLocationById(location_id: number): Promise<import("./entities/location.model").Location | null>;
    createLocation(locationData: any): Promise<import("./entities/location.model").Location[]>;
    deleteLocation(location_id: number): Promise<{
        message: string;
    }>;
    updateLocation(location_id: number, updateData: any): Promise<import("./entities/location.model").Location>;
}
