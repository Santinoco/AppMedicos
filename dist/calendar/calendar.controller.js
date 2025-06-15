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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
let CalendarController = class CalendarController {
    calendarService;
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    async generateSlots() {
        return this.calendarService.generateSlots();
    }
    async getSlots() {
        return this.calendarService.getSlots();
    }
    async getDoctorAppointments(doctorUserId) {
        return this.calendarService.getAppointmentsForDoctor(doctorUserId);
    }
    async getDoctorAvailableSlots(doctorUserId) {
        return this.calendarService.getAvailableSlotsForDoctor(doctorUserId);
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Post)("generateslots"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "generateSlots", null);
__decorate([
    (0, common_1.Get)("getslots"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getSlots", null);
__decorate([
    (0, common_1.Get)('doctor-appointments'),
    __param(0, (0, common_1.Query)('doctorUserId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getDoctorAppointments", null);
__decorate([
    (0, common_1.Get)('doctor-available-slots'),
    __param(0, (0, common_1.Query)('doctorUserId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "getDoctorAvailableSlots", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)('calendar'),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map