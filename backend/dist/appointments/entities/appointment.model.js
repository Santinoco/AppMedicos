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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const appointment_status_model_1 = require("../../appointment-statuses/entities/appointment-status.model");
const doctor_model_1 = require("../../doctors/entities/doctor.model");
const patient_model_1 = require("../../patients/entities/patient.model");
let Appointment = class Appointment {
    id;
    fecha;
    hora;
    motivo;
    estado_id;
    doctor_id;
    patient_id;
    status;
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Appointment.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Appointment.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Appointment.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Appointment.prototype, "estado_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => doctor_model_1.Doctor, (doctor) => doctor.user_id),
    (0, typeorm_1.JoinColumn)({ name: "doctor_id" }),
    __metadata("design:type", Number)
], Appointment.prototype, "doctor_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_model_1.Patient, (patient) => patient.user_id),
    (0, typeorm_1.JoinColumn)({ name: "patient_id" }),
    __metadata("design:type", Number)
], Appointment.prototype, "patient_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => appointment_status_model_1.AppointmentStatus, (status) => status.status),
    (0, typeorm_1.JoinColumn)({ name: "estado_id", referencedColumnName: "status_id" }),
    __metadata("design:type", appointment_status_model_1.AppointmentStatus)
], Appointment.prototype, "status", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)()
], Appointment);
//# sourceMappingURL=appointment.model.js.map