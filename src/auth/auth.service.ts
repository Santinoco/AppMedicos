import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserType } from 'src/user-type/entities/user-type.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserType) private readonly userTypeRepository: Repository<UserType>,
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

        const userType = await this.userTypeRepository.findOne({
            where: { name: registerDto.type } 
        });
        if (!userType) {
            throw new BadRequestException('Tipo de usuario invalido');
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
        }
    }

    /*async register(registerDto: RegisterAuthDto) {
        const existingUsers = await this.usersService.getAllUsers();
        const userExists = existingUsers.find(user => user.email === registerDto.email);
      
        if (userExists) {
          throw new ConflictException('El usuario ya existe');
        }
      
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
        
        const userType = await this.userTypeRepository.findOne({
          where: { id: registerDto.type }   
        });
        if (!userType) {
          throw new BadRequestException('Tipo de usuario inválido');
        }
      
        
        const newUser = await this.usersService.createUser({
          ...registerDto,
          password: hashedPassword,
          type: userType                  
        });
      
        const payload = { email: newUser.email, sub: newUser.id, role: userType.name };
        return {
          user: {
            id: newUser.id,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            email: newUser.email,
            type: newUser.type
          },
          access_token: await this.jwtService.sign(payload)
        }
    }*/

    async login(loginDto: LoginAuthDto) {
        const user = await this.usersService.findByEmailWithType(loginDto.email);
        if(!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Credenciales invalidas');
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
        }
    }
}
