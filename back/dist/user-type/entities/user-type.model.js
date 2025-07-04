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
exports.UserType = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("../../users/entities/user.model");
let UserType = class UserType {
    id;
    name;
    users;
};
exports.UserType = UserType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], UserType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_model_1.User, user => user.type),
    __metadata("design:type", Array)
], UserType.prototype, "users", void 0);
exports.UserType = UserType = __decorate([
    (0, typeorm_1.Entity)()
], UserType);
//# sourceMappingURL=user-type.model.js.map