import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { Appointment } from "./entities/appointment.model";
import { Calendar } from "src/calendar/entities/calendar.model";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Calendar])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
