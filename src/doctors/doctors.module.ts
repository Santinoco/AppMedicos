import { Module } from "@nestjs/common";
import { DoctorsController } from "./doctors.controller";
import { DoctorsService } from "./doctors.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./entities/doctor.model";
import { User } from "../users/entities/user.model";

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorModule {}