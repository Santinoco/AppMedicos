// src/locations/location.module.ts
import { Module } from "@nestjs/common";
import { LocationController } from "./locations.controller";
import { LocationService } from "./locations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "./entities/location.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Location]), AuthModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}