import { UserType } from "../../user-type/entities/user-type.model";
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    activo: boolean;
    type: UserType;
}
