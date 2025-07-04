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
exports.AppointmentStatusController = void 0;
const common_1 = require("@nestjs/common");
const appointment_status_service_1 = require("./appointment-status.service");
const roles_guard_1 = require("../auth/roles/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let AppointmentStatusController = class AppointmentStatusController {
    statusService;
    constructor(statusService) {
        this.statusService = statusService;
    }
    async getAllStatuses() {
        return this.statusService.getAllStatuses();
    }
    async getStatusById(status_id) {
        return this.statusService.getStatusById(status_id);
    }
    async createStatus(statusData) {
        return this.statusService.createStatus(statusData);
    }
};
exports.AppointmentStatusController = AppointmentStatusController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "getAllStatuses", null);
__decorate([
    (0, common_1.Get)(":status_id"),
    __param(0, (0, common_1.Param)("status_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "getStatusById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentStatusController.prototype, "createStatus", null);
exports.AppointmentStatusController = AppointmentStatusController = __decorate([
    (0, common_1.Controller)("appointment-statuses"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("administrator"),
    __metadata("design:paramtypes", [appointment_status_service_1.AppointmentStatusService])
], AppointmentStatusController);
//# sourceMappingURL=appointment-status.controller.js.map