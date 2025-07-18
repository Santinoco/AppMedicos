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
        try {
            return this.patientRepository.find({ relations: ["user"], order: { user_id: "ASC" } });
        }
        catch (error) {
            throw new Error(`Failed to retrieve patients: ${error.message}`);
        }
    }
    async getAllPatientsLimit(page = 1, limit = 5) {
        try {
            const skip = (page - 1) * limit;
            const [patients, total] = await this.patientRepository.findAndCount({
                relations: ["user"],
                order: { user_id: "ASC" },
                skip,
                take: limit
            });
            const total_pages = Math.ceil(total / limit);
            return {
                data: patients,
                pagination: {
                    current_page: page,
                    total_pages,
                    total_items: total,
                    items_per_page: limit,
                    has_next_page: page < total_pages,
                    has_previous_page: page > 1
                }
            };
        }
        catch (error) {
            throw new Error(`Failed to retrieve patients: ${error.message}`);
        }
    }
    async getPatientById(user_id) {
        try {
            return this.patientRepository.findOne({
                where: { user_id },
                relations: ["user"],
            });
        }
        catch (error) {
            throw new Error(`Failed to retrieve patient with user_id ${user_id}: ${error.message}`);
        }
    }
    async createPatient(patientData) {
        try {
            const patient = this.patientRepository.create(patientData);
            return this.patientRepository.save(patient);
        }
        catch (error) {
            throw new Error(`Failed to create patient: ${error.message}`);
        }
    }
    async updatePatient(user_id, updateData) {
        try {
            const patient = await this.patientRepository.findOne({ where: { user_id } });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with user_id ${user_id} not found`);
            }
            Object.assign(patient, updateData);
            return this.patientRepository.save(patient);
        }
        catch (error) {
            throw new Error(`Failed to update patient with user_id ${user_id}: ${error.message}`);
        }
    }
    async deletePatient(user_id) {
        try {
            const patient = await this.patientRepository.findOne({ where: { user_id } });
            if (!patient) {
                throw new common_1.NotFoundException(`Patient with user_id ${user_id} not found`);
            }
            await this.appointmentRepository.delete({ patient: { user_id } });
            await this.patientRepository.delete({ user_id });
            return { message: "Patient and related appointments deleted successfully" };
        }
        catch (error) {
            throw new Error(`Failed to delete patient with user_id ${user_id}: ${error.message}`);
        }
    }
    async getPatientByName(name) {
        try {
            const patients = await this.patientRepository.find({
                where: {
                    user: { nombre: name },
                },
                relations: ["user"],
                order: { user_id: "ASC" },
            });
            return patients;
        }
        catch (error) {
            throw new Error(`Failed to retrieve patients by name ${name}: ${error.message}`);
        }
    }
    async getPatientByNameLimit(name, page = 1, limit = 5) {
        try {
            const skip = (page - 1) * limit;
            const [patients, total] = await this.patientRepository.findAndCount({
                where: {
                    user: { nombre: name },
                },
                relations: ["user"],
                order: { user_id: "ASC" },
                skip,
                take: limit
            });
            const total_pages = Math.ceil(total / limit);
            return {
                data: patients,
                pagination: {
                    current_page: page,
                    total_pages,
                    total_items: total,
                    items_per_page: limit,
                    has_next_page: page < total_pages,
                    has_previous_page: page > 1
                }
            };
        }
        catch (error) {
            throw new Error(`Failed to retrieve patients by name ${name}: ${error.message}`);
        }
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