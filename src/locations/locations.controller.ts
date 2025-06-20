import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Delete,
    Patch,
    UseGuards
  } from "@nestjs/common";
  import { LocationService } from "./locations.service";
  import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles/roles.guard";
import { Roles } from "src/auth/roles/roles.decorator";
  
  @Controller("locations")
  @UseGuards(JwtAuthGuard, RolesGuard)
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

    @Delete(':location_id')
    @Roles("administrator")
    async deleteLocation(
      @Param('location_id', ParseIntPipe) location_id: number
    ) {
      return this.locationService.deleteLocation(location_id);
    }

    @Patch(':location_id')
    async updateLocation(
      @Param('location_id', ParseIntPipe) location_id: number,
      @Body() updateData: any,
    ) {
      return this.locationService.updateLocation(location_id, updateData);
    }

  }