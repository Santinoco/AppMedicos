import { User } from "../../users/entities/user.model";
import { Appointment } from "../../appointments/entities/appointment.model";
export declare class Doctor {
    user_id: number;
    user: User;
    specialty: string;
    shift_start: string;
    shift_end: string;
    getShiftStart(): string;
    setShiftStart(value: string): void;
    getShiftEnd(): string;
    setShiftEnd(value: string): void;
    license_number: number;
    active: boolean;
    appointments: Appointment[];
}
