import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { DoctorModule } from './doctors/doctors.module';
import { PatientModule } from './patients/patients.module';
import { AppointmentStatusModule } from "./appointment-statuses/appointment-status.module";
import { UserTypeModule } from './user-type/user-type.module';
import { AuthModule } from "./auth/auth.module";
import { CalendarModule } from "./calendar/calendar.module";

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule, DoctorModule, PatientModule, AppointmentStatusModule, UserTypeModule, AuthModule, CalendarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
