import { Appointment } from "../../appointments/entities/appointment.model";
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    activo: boolean;
    appointments: Appointment[];
}
