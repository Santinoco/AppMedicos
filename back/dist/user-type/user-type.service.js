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
exports.UserTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_type_model_1 = require("./entities/user-type.model");
let UserTypeService = class UserTypeService {
    userTypeRepository;
    constructor(userTypeRepository) {
        this.userTypeRepository = userTypeRepository;
    }
    async create(data) {
        const userType = this.userTypeRepository.create(data);
        return this.userTypeRepository.save(userType);
    }
    async findAll() {
        return this.userTypeRepository.find({ order: { id: "ASC" } });
    }
    async findOne(id) {
        const userType = await this.userTypeRepository.findOne({ where: { id } });
        if (!userType)
            throw new common_1.NotFoundException('UserType not found');
        return userType;
    }
    async update(id, data) {
        await this.userTypeRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.userTypeRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('UserType not found');
        return { message: "UserType deleted successfully" };
    }
};
exports.UserTypeService = UserTypeService;
exports.UserTypeService = UserTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_type_model_1.UserType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserTypeService);
//# sourceMappingURL=user-type.service.js.map