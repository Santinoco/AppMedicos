import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
  } from "@nestjs/common";
  import { LocationService } from "./locations.service";
  
  @Controller("locations")
  export class LocationController {
    constructor(private readonly locationService: LocationService) {}
  
    @Get()
    async getAllLocations() {
      return this.locationService.getAllLocations();
    }
  
    @Get(":location_id")
    async getLocationById(@Param("location_id", ParseIntPipe) location_id: number) {
      return this.locationService.getLocationById(location_id);
    }
  
    @Post()
    async createLocation(@Body() locationData: any) {
      return this.locationService.createLocation(locationData);
    }
  }