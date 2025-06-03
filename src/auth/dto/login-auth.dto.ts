import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";
export class LoginAuthDto {
    @IsEmail()
    email: string;
    
    @MinLength(4)
    @MaxLenght(16)
    password: string;
}