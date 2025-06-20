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
        return this.doctorRepository.find({ relations: ["user"], order: { user_id: "ASC" } });
    }
    async getDoctorById(user_id) {
        return this.doctorRepository.findOne({
            where: { user_id },
            relations: ["user"],
        });
    }
    async createDoctor(doctorData) {
        const doctor = this.doctorRepository.create(doctorData);
        return this.doctorRepository.save(doctor);
    }
    async updateDoctor(user_id, updateData) {
        const doctor = await this.doctorRepository.findOne({ where: { user_id } });
        if (!doctor)
            throw new common_1.NotFoundException(`Doctor with user_id ${user_id} not found`);
        Object.assign(doctor, updateData);
        return this.doctorRepository.save(doctor);
    }
    async deleteDoctor(user_id) {
        await this.appointmentRepository.delete({ doctor_id: user_id });
        const result = await this.doctorRepository.delete({ user_id });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Doctor with user_id ${user_id} not found`);
        }
        return { message: "Doctor and related appointments deleted successfully" };
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