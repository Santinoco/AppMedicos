"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_model_1 = require("./entities/user.model");
const doctor_model_1 = require("../doctors/entities/doctor.model");
const patient_model_1 = require("../patients/entities/patient.model");
const doctors_service_1 = require("../doctors/doctors.service");
const patients_service_1 = require("../patients/patients.service");
const auth_module_1 = require("../auth/auth.module");
const appointment_model_1 = require("../appointments/entities/appointment.model");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_model_1.User, doctor_model_1.Doctor, patient_model_1.Patient, appointment_model_1.Appointment]), (0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        controllers: [users_controller_1.UsersController],
        providers: [user_service_1.UserService, doctors_service_1.DoctorsService, patients_service_1.PatientService],
        exports: [user_service_1.UserService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map