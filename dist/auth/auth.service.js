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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
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
        const newUser = await this.usersService.createUser({
            email: registerDto.email,
            nombre: registerDto.nombre,
            apellido: registerDto.apellido,
            password: hashedPassword
        });
        const payload = { email: newUser.email, sub: newUser.id };
        return {
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                email: newUser.email
            },
            access_token: await this.jwtService.sign(payload)
        };
    }
    async login(loginDto) {
        const users = await this.usersService.getAllUsers();
        const user = users.find(user => user.email === loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            },
            access_token: await this.jwtService.sign(payload)
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map