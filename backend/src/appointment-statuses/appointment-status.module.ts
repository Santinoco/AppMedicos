import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentStatus } from "./entities/appointment-status.model";
import { AppointmentStatusController } from "./appointment-status.controller";
import { AppointmentStatusService } from "./appointment-status.service";

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentStatus])],
  controllers: [AppointmentStatusController],
  providers: [AppointmentStatusService],
  exports: [AppointmentStatusService],
})
export class AppointmentStatusModule {}