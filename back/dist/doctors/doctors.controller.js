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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const doctors_service_1 = require("./doctors.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let DoctorsController = class DoctorsController {
    doctorService;
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    async getAllDoctors() {
        const docs = await this.doctorService.getAllDoctors();
        console.log('✅ Doctores encontrados:', docs);
        return docs;
    }
    async getDoctorById(user_id) {
        return this.doctorService.getDoctorById(user_id);
    }
    async createDoctor(doctorData) {
        return this.doctorService.createDoctor(doctorData);
    }
    async updateDoctor(user_id, updateData) {
        return this.doctorService.updateDoctor(user_id, updateData);
    }
    async deleteDoctor(user_id) {
        return this.doctorService.deleteDoctor(user_id);
    }
    async getDoctorsBySpecialty(specialty) {
        return this.doctorService.getDoctorBySpeciality(specialty);
    }
    async getDoctorsByName(nombre) {
        return this.doctorService.getDoctorByName(nombre);
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAllDoctors", null);
__decorate([
    (0, common_1.Get)(":user_id"),
    __param(0, (0, common_1.Param)("user_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)("administrator"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "createDoctor", null);
__decorate([
    (0, common_1.Patch)(":user_id"),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateDoctor", null);
__decorate([
    (0, common_1.Delete)(":user_id"),
    (0, roles_decorator_1.Roles)("administrator"),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "deleteDoctor", null);
__decorate([
    (0, common_1.Get)("specialty/:specialty"),
    __param(0, (0, common_1.Param)("specialty")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorsBySpecialty", null);
__decorate([
    (0, common_1.Get)("by-name/:nombre"),
    __param(0, (0, common_1.Param)("nombre")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorsByName", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, common_1.Controller)("doctors"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map