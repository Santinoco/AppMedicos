import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";
import { CreateAppointmentDto } from "./dto/calendar.dto";
import { Calendar } from "./../calendar/entities/calendar.model"
import { Between } from "typeorm";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
  ) {}

  async getAllAppointments() {
    try {
      return this.appointmentRepository.find({
        relations: [
          'patient_id',
          'patient.user',
          'doctor_id',
          'doctor.user',
          'status',
          'slot_datetime',
        ], order: { id: "ASC"}})
    } catch (error) {
      throw new BadRequestException('Error al obtener los turnos.');
    }
  }

  async getAppointmentById(id: number) {
    try {
      const appointment = await this.appointmentRepository.findOne({ relations: [
        'patient_id',
        'patient.user',
        'doctor_id',
        'doctor.user',
        'status',
        'slot_datetime',
      ], where: { id } });
      if (!appointment) {
        throw new NotFoundException(`Turno con ID ${id} no encontrado`);
      }
      return appointment;
    } catch (error) {
      throw new NotFoundException('Error al obtener el turno.');
    }
  }

  async createAppointment(dto: CreateAppointmentDto) {
    try {
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
    } catch (error) {
      throw new BadRequestException('Error al crear el turno.');
    }
  }

  async updateAppointmentStatus(id: number, newStatus: number) {
    try {
      await this.appointmentRepository.update(id, { estado_id: newStatus });
      return this.getAppointmentById(id);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el estado del turno.');
    }
  }

  async findByDoctorId(doctorUserId: number) {
    try {
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
    } catch (error) {
      throw new BadRequestException('Error al obtener los turnos del doctor.');
    }
  }
  
  async findByPatientId(patientUserId: number) {
    try {
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
    } catch (error) {
      throw new BadRequestException('Error al obtener los turnos del paciente.');
    }
  }

  async deleteAppointment(id: number) {
    try {
      const appointment = await this.appointmentRepository.findOne({ where: { id } });
      if (!appointment) {
        throw new NotFoundException(`Cita con ID ${id} no encontrada`);
      }
      await this.appointmentRepository.remove(appointment);
      return "Turno eliminado correctamente";
    } catch (error) {
      throw new BadRequestException('Error al eliminar el turno.');
    }
  }

  async getAppointmentsByPatientName(name: string) {
    try {
      const appointments = await this.appointmentRepository.find({
        where: {
          patient: { user: { nombre: name } },
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
      return appointments;
    } catch (error) {
      throw new BadRequestException('Error al obtener los turnos por nombre de paciente.');
    }
  }

  async getAppointmentsByDate(date: Date) {
    try {
      const input = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
      const start = new Date(input);
      start.setHours(0, 0, 0, 0);
      const end = new Date(input);
      end.setHours(23, 59, 59, 999);

      const appointments = await this.appointmentRepository.find({
        where: {
          slot_datetime: {
            slot_datetime: Between(start, end),
          },
        },
        relations: [
          'doctor', 'doctor.user',
          'patient', 'patient.user',
          'status', 'slot_datetime'
        ],
        order: {
          id: 'ASC',
        }
      });
      return appointments;
    } catch (error) {
      throw new BadRequestException('Error al obtener los turnos por fecha.');
    }
  }
}