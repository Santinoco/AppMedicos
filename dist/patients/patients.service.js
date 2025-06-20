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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_model_1 = require("./entities/patient.model");
const appointment_model_1 = require("../appointments/entities/appointment.model");
let PatientService = class PatientService {
    patientRepository;
    appointmentRepository;
    constructor(patientRepository, appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }
    async getAllPatients() {
        return this.patientRepository.find({ relations: ["user"] });
    }
    async getPatientById(user_id) {
        return this.patientRepository.findOne({
            where: { user_id },
            relations: ["user"],
        });
    }
    async createPatient(patientData) {
        const patient = this.patientRepository.create(patientData);
        return this.patientRepository.save(patient);
    }
    async updatePatient(user_id, updateData) {
        const patient = await this.patientRepository.findOne({ where: { user_id } });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with user_id ${user_id} not found`);
        }
        Object.assign(patient, updateData);
        return this.patientRepository.save(patient);
    }
    async deletePatient(user_id) {
        const patient = await this.patientRepository.findOne({ where: { user_id } });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with user_id ${user_id} not found`);
        }
        await this.appointmentRepository.delete({ patient: { user_id } });
        await this.patientRepository.delete({ user_id });
        return { message: "Patient and related appointments deleted successfully" };
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_model_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(appointment_model_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PatientService);
//# sourceMappingURL=patients.service.js.map