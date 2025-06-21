import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

  async getAllAppointments() {
    return this.appointmentRepository.find({
      relations: [
        'patient_id',
        'patient.user',
        'doctor_id',
        'doctor.user',
        'status',
        'slot_datetime',
      ], order: { id: "ASC"}})
  }

  async getAppointmentById(id: number) {
    return this.appointmentRepository.findOne({ relations: [
      'patient_id',
      'patient.user',
      'doctor_id',
      'doctor.user',
      'status',
      'slot_datetime',
    ], where: { id } });
  }

  async createAppointment(dto: CreateAppointmentDto) {
    const slot = await this.calendarRepository.findOne({ where: { slot_datetime: dto.slot_datetime } });
  
    if (!slot) {
      throw new NotFoundException("No existe un slot para esa fecha y hora.");
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

  async findByDoctorId(doctorUserId: number) {
    return this.appointmentRepository.find({
      where: {
        doctor: { user_id: doctorUserId },
      },
      relations: [
        'doctor', 'doctor.user',
        'patient', 'patient.user',
        'status',
      ],
      order: {
        id: 'ASC',
      },
    });
  }
  
  async findByPatientId(patientUserId: number) {
    return this.appointmentRepository.find({
      where: {
        patient: { user_id: patientUserId },
      },
      relations: [
        'doctor', 'doctor.user',
        'patient', 'patient.user',
        'status',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async deleteAppointment(id: number) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    await this.appointmentRepository.remove(appointment);
    return "Turno eliminado correctamente";
  }
}