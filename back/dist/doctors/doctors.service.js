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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_model_1 = require("./entities/doctor.model");
const appointment_model_1 = require("../appointments/entities/appointment.model");
let DoctorsService = class DoctorsService {
    doctorRepository;
    appointmentRepository;
    constructor(doctorRepository, appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }
    async getAllDoctors() {
        try {
            return await this.doctorRepository.find({ relations: ["user"], order: { user_id: "ASC" } });
        }
        catch (error) {
            throw new Error('Error al obtener los médicos: ' + error.message);
        }
    }
    async getDoctorById(user_id) {
        try {
            return await this.doctorRepository.findOne({
                where: { user_id },
                relations: ["user"],
            });
        }
        catch (error) {
            throw new Error('Error al obtener el médico: ' + error.message);
        }
    }
    async createDoctor(doctorData) {
        try {
            const doctor = this.doctorRepository.create(doctorData);
            return await this.doctorRepository.save(doctor);
        }
        catch (error) {
            throw new Error('Error al crear el médico: ' + error.message);
        }
    }
    async updateDoctor(user_id, updateData) {
        try {
            const doctor = await this.doctorRepository.findOne({ where: { user_id } });
            if (!doctor)
                throw new common_1.NotFoundException(`Doctor with user_id ${user_id} not found`);
            Object.assign(doctor, updateData);
            return await this.doctorRepository.save(doctor);
        }
        catch (error) {
            throw new Error('Error al actualizar el médico: ' + error.message);
        }
    }
    async deleteDoctor(user_id) {
        try {
            await this.appointmentRepository.delete({ doctor_id: user_id });
            const result = await this.doctorRepository.delete({ user_id });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Doctor with user_id ${user_id} not found`);
            }
            return { message: "Doctor and related appointments deleted successfully" };
        }
        catch (error) {
            throw new Error('Error al eliminar el médico: ' + error.message);
        }
    }
    async getDoctorBySpeciality(specialty) {
        try {
            return await this.doctorRepository.find({
                where: { specialty: specialty },
                relations: ["user"],
            });
        }
        catch (error) {
            throw new Error('Error al obtener médicos por especialidad: ' + error.message);
        }
    }
    async getDoctorByName(name) {
        try {
            return await this.doctorRepository.find({
                where: { user: { nombre: name } },
                relations: ["user"],
            });
        }
        catch (error) {
            throw new Error('Error al obtener médicos por nombre: ' + error.message);
        }
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_model_1.Doctor)),
    __param(1, (0, typeorm_1.InjectRepository)(appointment_model_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map