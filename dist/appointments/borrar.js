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
let AppointmentsService = class AppointmentsService {
    appointmentRepo;
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async findByDoctorId(doctorUserId) {
        return this.appointmentRepo.find({
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
    async findByPatientId(patientUserId) {
        return this.appointmentRepo.find({
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_model_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=borrar.js.map