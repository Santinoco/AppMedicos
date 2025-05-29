import { User } from "../../users/entities/user.model";
export declare class Appointment {
    id: number;
    fecha: Date;
    hora: string;
    motivo: string;
    estado: string;
    userId: number;
    user: User;
}
