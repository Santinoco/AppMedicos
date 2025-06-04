import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
