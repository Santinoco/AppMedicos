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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcrypt");
const user_type_model_1 = require("../user-type/entities/user-type.model");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AuthService = class AuthService {
    userTypeRepository;
    usersService;
    jwtService;
    constructor(userTypeRepository, usersService, jwtService) {
        this.userTypeRepository = userTypeRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const user = await this.usersService.getAllUsers();
        const userExists = user.find(user => user.email === registerDto.email);
        if (userExists) {
            throw new common_1.ConflictException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const userType = await this.userTypeRepository.findOne({
            where: { name: registerDto.type }
        });
        if (!userType) {
            throw new common_1.BadRequestException('Tipo de usuario invalido');
        }
        const newUser = await this.usersService.createUser({
            ...registerDto,
            password: hashedPassword,
            type: userType
        });
        const payload = { email: newUser.email, sub: newUser.id, role: newUser.type.name };
        return {
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                email: newUser.email,
                type: newUser.type
            },
            access_token: await this.jwtService.sign(payload)
        };
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmailWithType(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const payload = { email: user.email, sub: user.id, role: user.type.name };
        return {
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                type: user.type
            },
            access_token: await this.jwtService.sign(payload)
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_type_model_1.UserType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map