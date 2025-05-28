import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // Obtener todas las citas
  async getAllAppointments() {
    return this.appointmentRepository.find();
  }

  // Obtener una cita por ID
  async getAppointmentById(id: number) {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  // Crear una nueva cita
  async createAppointment(appointmentData: any) {
    const appointment = this.appointmentRepository.create(appointmentData);
    return this.appointmentRepository.save(appointment);
  }

  // Actualizar estado de una cita
  async updateAppointmentStatus(id: number, newStatus: string) {
    await this.appointmentRepository.update(id, { estado: newStatus });
    return this.getAppointmentById(id);
  }
}



/*
  // Obtener citas de un usuario específico
  async getUserAppointments(userId: number) {
    return this.appointmentRepository.find({ 
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }
*/