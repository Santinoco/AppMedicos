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
exports.PatientController = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("./patients.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let PatientController = class PatientController {
    patientService;
    constructor(patientService) {
        this.patientService = patientService;
    }
    async getAllPatients() {
        return this.patientService.getAllPatients();
    }
    async getPatientById(user_id) {
        return this.patientService.getPatientById(user_id);
    }
    async createPatient(patientData) {
        return this.patientService.createPatient(patientData);
    }
    async updatePatient(user_id, updateData) {
        return this.patientService.updatePatient(user_id, updateData);
    }
    async deletePatient(user_id) {
        return this.patientService.deletePatient(user_id);
    }
};
exports.PatientController = PatientController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getAllPatients", null);
__decorate([
    (0, common_1.Get)(":user_id"),
    __param(0, (0, common_1.Param)("user_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "getPatientById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "createPatient", null);
__decorate([
    (0, common_1.Patch)(":user_id"),
    __param(0, (0, common_1.Param)("user_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "updatePatient", null);
__decorate([
    (0, common_1.Delete)(":user_id"),
    (0, roles_decorator_1.Roles)("administrator"),
    __param(0, (0, common_1.Param)("user_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "deletePatient", null);
exports.PatientController = PatientController = __decorate([
    (0, common_1.Controller)("patients"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [patients_service_1.PatientService])
], PatientController);
//# sourceMappingURL=patients.controller.js.map