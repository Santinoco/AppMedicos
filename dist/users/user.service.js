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
        return this.userRepository.find();
    }
    async getUserById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async createUser(userData) {
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
    async getUserAppoinments(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["appointments"],
        });
        return {
            user,
            message: `Citas del usuario con id: ${id}`,
        };
    }
    async updateUser(id, updateData) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException("User with id ${id} not found");
        Object.assign(user, updateData);
        return this.userRepository.save(user);
    }
    async deleteUser(id) {
        const result = await this.userRepository.delete({ id });
        if (result.affected === 0) {
            throw new common_1.NotFoundException("User with id ${id} not found");
        }
        return { message: `User deleted succesfully` };
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