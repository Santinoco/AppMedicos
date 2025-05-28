import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { DoctorModule } from './doctors/doctors.module';

@Module({
  imports: [DatabaseModule, UsersModule, AppointmentsModule, DoctorModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
