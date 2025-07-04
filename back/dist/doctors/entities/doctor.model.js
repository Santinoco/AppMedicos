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
exports.Doctor = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("../../users/entities/user.model");
const appointment_model_1 = require("../../appointments/entities/appointment.model");
let Doctor = class Doctor {
    user_id;
    user;
    specialty;
    shift_start;
    shift_end;
    getShiftStart() {
        return this.shift_start;
    }
    setShiftStart(value) {
        this.shift_start = value;
    }
    getShiftEnd() {
        return this.shift_end;
    }
    setShiftEnd(value) {
        this.shift_end = value;
    }
    license_number;
    active;
    appointments;
};
exports.Doctor = Doctor;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Doctor.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.User, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_model_1.User)
], Doctor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Doctor.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Doctor.prototype, "shift_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Doctor.prototype, "shift_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Doctor.prototype, "license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, nullable: true }),
    __metadata("design:type", Boolean)
], Doctor.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointment_model_1.Appointment, (appointment) => appointment.doctor_id),
    __metadata("design:type", Array)
], Doctor.prototype, "appointments", void 0);
exports.Doctor = Doctor = __decorate([
    (0, typeorm_1.Entity)()
], Doctor);
//# sourceMappingURL=doctor.model.js.map