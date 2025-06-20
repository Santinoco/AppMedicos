import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentStatus } from "./entities/appointment-status.model";
import { AppointmentStatusController } from "./appointment-status.controller";
import { AppointmentStatusService } from "./appointment-status.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentStatus]), AuthModule],
  controllers: [AppointmentStatusController],
  providers: [AppointmentStatusService],
  exports: [AppointmentStatusService],
})
export class AppointmentStatusModule {}