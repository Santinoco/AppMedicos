import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppointmentStatus } from "./entities/appointment-status.model";

@Injectable()
export class AppointmentStatusService {
  constructor(
    @InjectRepository(AppointmentStatus)
    private appointmentStatusRepository: Repository<AppointmentStatus>,
  ) {}

  async getAllStatuses() {
    return this.appointmentStatusRepository.find();
  }

  async getStatusById(status_id: number) {
    return this.appointmentStatusRepository.findOne({ where: { status_id } });
  }

  async createStatus(statusData: any) {
    const status = this.appointmentStatusRepository.create(statusData);
    return this.appointmentStatusRepository.save(status);
  }

  
}