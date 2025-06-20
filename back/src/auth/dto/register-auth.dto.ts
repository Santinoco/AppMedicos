import { IsNotEmpty } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends LoginAuthDto {
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    apellido: string;

    @IsNotEmpty()
    type: string;
}