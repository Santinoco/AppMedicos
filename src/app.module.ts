import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { DoctorModule } from './doctors/doctors.module';
import { PatientModule } from './patients/patients.module';

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule, DoctorModule, PatientModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
