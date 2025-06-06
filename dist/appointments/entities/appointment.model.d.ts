import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
export declare class Appointment {
    id: number;
    fecha: Date;
    hora: string;
    motivo: string;
    estado_id: number;
    doctor_id: number;
    patient_id: number;
    status: AppointmentStatus;
}
