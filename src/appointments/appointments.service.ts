import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";
import { CreateAppointmentDto } from "./dto/calendar.dto";
import { Calendar } from "./../calendar/entities/calendar.model"

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
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
  async createAppointment(dto: CreateAppointmentDto) {
    const slot = await this.calendarRepository.findOne({ where: { slot_datetime: dto.slot_datetime } });
  
    if (!slot) {
      throw new BadRequestException("No existe un slot para esa fecha y hora."); // cambiar por NotFound
    }
  
    const appointment = this.appointmentRepository.create({
      motivo: dto.motivo,
      slot_datetime: slot,
      doctor_id: dto.doctor_id,
      patient_id: dto.patient_id,
    });
  
    return await this.appointmentRepository.save(appointment);
  }

  async updateAppointmentStatus(id: number, newStatus: number) {
    await this.appointmentRepository.update(id, { estado_id: newStatus });
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