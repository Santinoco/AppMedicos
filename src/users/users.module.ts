import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";
import { DoctorsService } from "src/doctors/doctors.service";
import { PatientService } from "src/patients/patients.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor, Patient]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UserService, DoctorsService, PatientService],
  exports: [UserService],
})
export class UsersModule {}
