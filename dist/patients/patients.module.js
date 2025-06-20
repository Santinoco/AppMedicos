"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModule = void 0;
const common_1 = require("@nestjs/common");
const patients_controller_1 = require("./patients.controller");
const patients_service_1 = require("./patients.service");
const typeorm_1 = require("@nestjs/typeorm");
const patient_model_1 = require("./entities/patient.model");
const user_model_1 = require("../users/entities/user.model");
const auth_module_1 = require("../auth/auth.module");
const appointment_model_1 = require("../appointments/entities/appointment.model");
let PatientModule = class PatientModule {
};
exports.PatientModule = PatientModule;
exports.PatientModule = PatientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([patient_model_1.Patient, user_model_1.User, appointment_model_1.Appointment]), auth_module_1.AuthModule],
        controllers: [patients_controller_1.PatientController],
        providers: [patients_service_1.PatientService],
        exports: [patients_service_1.PatientService],
    })
], PatientModule);
//# sourceMappingURL=patients.module.js.map