import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    register(registerDto: RegisterAuthDto): Promise<{
        user: {
            id: number;
            nombre: string;
            apellido: string;
            email: string;
        };
        access_token: string;
    }>;
    login(loginDto: LoginAuthDto): Promise<{
        user: {
            id: number;
            nombre: string;
            apellido: string;
            email: string;
        };
        access_token: string;
    }>;
}
