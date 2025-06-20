import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { Appointment } from "./entities/appointment.model";
import { Calendar } from "src/calendar/entities/calendar.model";
import { AuthModule } from "src/auth/auth.module";
import { CalendarService } from "src/calendar/calendar.service";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Calendar, Doctor, Patient]), AuthModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, CalendarService],
})
export class AppointmentsModule {}
