import { Module } from "@nestjs/common";
import { DoctorsController } from "./doctors.controller";
import { DoctorsService } from "./doctors.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./entities/doctor.model";
import { User } from "../users/entities/user.model";
import { AuthModule } from "src/auth/auth.module";
import { Appointment } from "src/appointments/entities/appointment.model";

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User, Appointment]), AuthModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorModule {}