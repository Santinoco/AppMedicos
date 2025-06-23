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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_model_1 = require("./entities/user.model");
const doctors_service_1 = require("../doctors/doctors.service");
const patients_service_1 = require("../patients/patients.service");
let UserService = class UserService {
    userRepository;
    doctorService;
    patientService;
    constructor(userRepository, doctorService, patientService) {
        this.userRepository = userRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }
    async getAllUsers() {
        try {
            return this.userRepository.find({ order: { id: "ASC" } });
        }
        catch (error) {
            throw new Error(`Failed to retrieve users: ${error.message}`);
        }
    }
    async getUserById(id) {
        try {
            return this.userRepository.findOne({ where: { id } });
        }
        catch (error) {
            throw new Error(`Failed to retrieve user with id ${id}: ${error.message}`);
        }
    }
    async createUser(userData) {
        try {
            const user = this.userRepository.create(userData);
            const savedUser = await this.userRepository.save(user);
            const userTypeId = userData.type?.id || userData.type;
            switch (userTypeId) {
                case 2:
                    await this.doctorService.createDoctor({ user_id: savedUser.id });
                    break;
                case 5:
                    await this.patientService.createPatient({ user_id: savedUser.id });
                    break;
            }
            return savedUser;
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }
    async getUserAppoinments(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ["appointments"],
            });
            return {
                user,
                message: `Citas del usuario con id: ${id}`,
            };
        }
        catch (error) {
            throw new Error(`Failed to retrieve appointments for user with id ${id}: ${error.message}`);
        }
    }
    async updateUser(id, updateData) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException(`User with id ${id} not found`);
            Object.assign(user, updateData);
            return this.userRepository.save(user);
        }
        catch (error) {
            throw new Error(`Failed to update user with id ${id}: ${error.message}`);
        }
    }
    async deleteUser(id) {
        try {
            const result = await this.userRepository.delete({ id });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`User with id ${id} not found`);
            }
            return { message: `User deleted succesfully` };
        }
        catch (error) {
            throw new Error(`Failed to delete user with id ${id}: ${error.message}`);
        }
    }
    async findByEmailWithType(email) {
        try {
            return this.userRepository.findOne({
                where: { email },
                relations: ['type'],
            });
        }
        catch (error) {
            throw new Error(`Failed to find user by email ${email}: ${error.message}`);
        }
    }
    async findUsersByName(nombre) {
        try {
            const users = await this.userRepository.find({ where: { nombre } });
            if (!users || users.length === 0) {
                throw new common_1.NotFoundException(`No se encontraron usuarios con el nombre ${nombre}`);
            }
            return users;
        }
        catch (error) {
            throw new Error(`Failed to find users by name ${nombre}: ${error.message}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        doctors_service_1.DoctorsService,
        patients_service_1.PatientService])
], UserService);
//# sourceMappingURL=user.service.js.map