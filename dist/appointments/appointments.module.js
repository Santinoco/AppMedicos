"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointments_controller_1 = require("./appointments.controller");
const appointments_service_1 = require("./appointments.service");
const appointment_model_1 = require("./entities/appointment.model");
const calendar_model_1 = require("../calendar/entities/calendar.model");
const auth_module_1 = require("../auth/auth.module");
const calendar_service_1 = require("../calendar/calendar.service");
const doctor_model_1 = require("../doctors/entities/doctor.model");
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([appointment_model_1.Appointment, calendar_model_1.Calendar, doctor_model_1.Doctor]), auth_module_1.AuthModule],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [appointments_service_1.AppointmentsService, calendar_service_1.CalendarService],
    })
], AppointmentsModule);
//# sourceMappingURL=appointments.module.js.map