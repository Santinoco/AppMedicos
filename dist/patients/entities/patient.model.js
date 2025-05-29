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
exports.Patient = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("../../users/entities/user.model");
let Patient = class Patient {
    user_id;
    user;
    completed_consultations;
    health_insurance;
    medical_history;
    weight;
    height;
    blood_type;
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Patient.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.User, { cascade: true, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_model_1.User)
], Patient.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Patient.prototype, "completed_consultations", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Patient.prototype, "health_insurance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "medical_history", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Patient.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Patient.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 5, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "blood_type", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)()
], Patient);
//# sourceMappingURL=patient.model.js.map