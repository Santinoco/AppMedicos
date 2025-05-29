import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { DoctorModule } from './doctors/doctors.module';
import { PatientModule } from './patients/patients.module';
import { LocationModule } from './locations/locations.module';
import { AppointmentStatusModule } from "./appointment-statuses/appointment-status.module";

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule, DoctorModule, PatientModule, LocationModule, AppointmentStatusModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
