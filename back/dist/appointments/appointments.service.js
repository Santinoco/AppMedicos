"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_model_1 = require("./entities/appointment.model");
const calendar_model_1 = require("./../calendar/entities/calendar.model");
const typeorm_3 = require("typeorm");
const calendar_service_1 = require("../calendar/calendar.service");
let AppointmentsService = class AppointmentsService {
    appointmentRepository;
    calendarRepository;
    calendarService;
    constructor(appointmentRepository, calendarRepository, calendarService) {
        this.appointmentRepository = appointmentRepository;
        this.calendarRepository = calendarRepository;
        this.calendarService = calendarService;
    }
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
                ], order: { id: "ASC" }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos.');
        }
    }
    async getAppointmentById(id) {
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
                throw new common_1.NotFoundException(`Turno con ID ${id} no encontrado`);
            }
            return appointment;
        }
        catch (error) {
            throw new common_1.NotFoundException('Error al obtener el turno.');
        }
    }
    async createAppointment(dto) {
        try {
            const slot = await this.calendarRepository.findOne({ where: { slot_datetime: dto.slot_datetime } });
            if (!slot) {
                throw new common_1.NotFoundException("No existe un slot para esa fecha y hora.");
            }
            const appointment = this.appointmentRepository.create({
                motivo: dto.motivo,
                slot_datetime: slot,
                doctor_id: dto.doctor_id,
                patient_id: dto.patient_id,
            });
            return await this.appointmentRepository.save(appointment);
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al crear el turno.');
        }
    }
    async updateAppointmentStatus(id, newStatus) {
        try {
            await this.appointmentRepository.update(id, { estado_id: newStatus });
            return this.getAppointmentById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al actualizar el estado del turno.');
        }
    }
    async findByDoctorId(doctorUserId) {
        try {
            return this.appointmentRepository.find({
                where: {
                    doctor: { user_id: doctorUserId },
                },
                relations: [
                    'doctor', 'doctor.user',
                    'patient', 'patient.user',
                    'status', 'slot_datetime',
                ],
                order: {
                    id: 'ASC',
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos del doctor.');
        }
    }
    async findByPatientId(patientUserId) {
        try {
            return this.appointmentRepository.find({
                where: {
                    patient: { user_id: patientUserId },
                },
                relations: [
                    'doctor', 'doctor.user',
                    'patient', 'patient.user',
                    'status', 'slot_datetime',
                ],
                order: {
                    id: 'ASC',
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos del paciente.');
        }
    }
    async deleteAppointment(id) {
        try {
            const appointment = await this.appointmentRepository.findOne({ where: { id } });
            if (!appointment) {
                throw new common_1.NotFoundException(`Cita con ID ${id} no encontrada`);
            }
            await this.appointmentRepository.remove(appointment);
            return "Turno eliminado correctamente";
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al eliminar el turno.');
        }
    }
    async getAppointmentsByPatientName(name) {
        try {
            const appointments = await this.appointmentRepository.find({
                where: {
                    patient: { user: { nombre: name } },
                },
                relations: [
                    'doctor', 'doctor.user',
                    'patient', 'patient.user',
                    'status', 'slot_datetime',
                ],
                order: {
                    id: 'ASC',
                },
            });
            return appointments;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos por nombre de paciente.');
        }
    }
    async getAppointmentsByDoctorName(name) {
        try {
            const appointments = await this.appointmentRepository.find({
                where: {
                    doctor: { user: { nombre: name } },
                },
                relations: [
                    'doctor', 'doctor.user',
                    'patient', 'patient.user',
                    'status', 'slot_datetime',
                ],
                order: {
                    id: 'ASC',
                },
            });
            return appointments;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos por nombre de medico.');
        }
    }
    async getAppointmentsByDate(date) {
        try {
            const input = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
            const start = new Date(input);
            start.setHours(0, 0, 0, 0);
            const end = new Date(input);
            end.setHours(23, 59, 59, 999);
            const appointments = await this.appointmentRepository.find({
                where: {
                    slot_datetime: {
                        slot_datetime: (0, typeorm_3.Between)(start, end),
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener los turnos por fecha.');
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_model_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(calendar_model_1.Calendar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        calendar_service_1.CalendarService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map