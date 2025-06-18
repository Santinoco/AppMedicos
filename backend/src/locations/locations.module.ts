// src/locations/location.module.ts
import { Module } from "@nestjs/common";
import { LocationController } from "./locations.controller";
import { LocationService } from "./locations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.model";

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}