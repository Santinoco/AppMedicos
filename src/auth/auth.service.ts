import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { identity } from 'rxjs';


@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ){}

    async register(registerDto: RegisterAuthDto) {
        const user = await this.usersService.getAllUsers();
        const userExists = user.find(user => user.email === registerDto.email);

        if(userExists) {
                throw new ConflictException('El usuario ya existe');
        }
        // Si no existe el usuario se crea el usuario nuevo con la contraseña encriptada 
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
        }
    }

    async login(loginDto: LoginAuthDto) {
        const users = await this.usersService.getAllUsers();
        const user = users.find(user => user.email === loginDto.email);
        if(!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Credenciales invalidas');
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
        }
    }
}
