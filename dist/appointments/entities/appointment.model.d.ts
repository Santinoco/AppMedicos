import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
import { Calendar } from "src/calendar/entities/calendar.model";
export declare class Appointment {
    id: number;
    slot_datetime: Calendar;
    motivo: string;
    estado_id: number;
    doctor_id: number;
    patient_id: number;
    status: AppointmentStatus;
}
