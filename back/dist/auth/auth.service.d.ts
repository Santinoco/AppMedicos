import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserType } from '../user-type/entities/user-type.model';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userTypeRepository;
    private usersService;
    private jwtService;
    constructor(userTypeRepository: Repository<UserType>, usersService: UserService, jwtService: JwtService);
    register(registerDto: RegisterAuthDto): Promise<{
        user: {
            id: number;
            nombre: string;
            apellido: string;
            email: string;
            type: UserType;
        };
        access_token: string;
    }>;
    login(loginDto: LoginAuthDto): Promise<{
        user: {
            id: number;
            nombre: string;
            apellido: string;
            email: string;
            type: UserType;
        };
        access_token: string;
    }>;
}
