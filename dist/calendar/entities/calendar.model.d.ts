import { Appointment } from '../../appointments/entities/appointment.model';
export declare class Calendar {
    slot_id: number;
    slot_datetime: Date;
    appointments: Appointment[];
}
