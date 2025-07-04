import { Module } from "@nestjs/common";
import { PatientController } from "./patients.controller";
import { PatientService } from "./patients.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.model";
import { User } from "../users/entities/user.model";
import { AuthModule } from "src/auth/auth.module";
import { Appointment } from "../appointments/entities/appointment.model";

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User, Appointment]), AuthModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}