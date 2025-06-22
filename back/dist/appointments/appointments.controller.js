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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const appointments_service_1 = require("./appointments.service");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async getAllAppointments() {
        return this.appointmentsService.getAllAppointments();
    }
    async getAppointmentById(id) {
        return this.appointmentsService.getAppointmentById(id);
    }
    async createAppointment(appointmentData) {
        return this.appointmentsService.createAppointment(appointmentData);
    }
    async updateStatus(id, newStatus) {
        return this.appointmentsService.updateAppointmentStatus(id, newStatus);
    }
    async getAppointmentsByDoctorId(doctor_id) {
        return this.appointmentsService.findByDoctorId(doctor_id);
    }
    async getAppointmentsByPatientId(patient_id) {
        return this.appointmentsService.findByPatientId(patient_id);
    }
    async deleteAppointment(id) {
        return this.appointmentsService.deleteAppointment(id);
    }
    async getAppointmentsByName(name) {
        return this.appointmentsService.getAppointmentsByPatientName(name);
    }
    async getAppointmentsByDate(date) {
        return this.appointmentsService.getAppointmentsByDate(date);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAllAppointments", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('doctor/:doctor_id'),
    __param(0, (0, common_1.Param)('doctor_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByDoctorId", null);
__decorate([
    (0, common_1.Get)('patient/:patient_id'),
    __param(0, (0, common_1.Param)('patient_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByPatientId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)("administrator"),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "deleteAppointment", null);
__decorate([
    (0, common_1.Get)('appointments-by-patient-name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByName", null);
__decorate([
    (0, common_1.Get)('appointments-by-date/:date'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByDate", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)("appointments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map