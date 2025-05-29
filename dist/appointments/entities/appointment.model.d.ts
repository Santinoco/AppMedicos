import { User } from "../../users/entities/user.model";
import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
export declare class Appointment {
    id: number;
    fecha: Date;
    hora: string;
    motivo: string;
    estado_id: number;
    userId: number;
    user: User;
    status: AppointmentStatus;
}
