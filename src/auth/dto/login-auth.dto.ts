import { IsEmail, MinLength, MaxLength } from "class-validator";
export class LoginAuthDto {
    @IsEmail()
    email: string;
    
    @MinLength(4)
    @MaxLength(16)
    password: string;
}