"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_model_1 = require("../users/entities/user.model");
const appointment_model_1 = require("../appointments/entities/appointment.model");
const doctor_model_1 = require("../doctors/entities/doctor.model");
const patient_model_1 = require("../patients/entities/patient.model");
const appointment_status_model_1 = require("../appointment-statuses/entities/appointment-status.model");
const user_type_model_1 = require("../user-type/entities/user-type.model");
const calendar_model_1 = require("../calendar/entities/calendar.model");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "postgres",
                password: "postgres",
                database: "appmedicos",
                entities: [user_model_1.User, appointment_model_1.Appointment, doctor_model_1.Doctor, patient_model_1.Patient, appointment_status_model_1.AppointmentStatus, user_type_model_1.UserType, calendar_model_1.Calendar],
                synchronize: false,
            }),
        ],
        exports: [typeorm_1.TypeOrmModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map