import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
import { Doctor } from "../../doctors/entities/doctor.model";
import { Patient } from "../../patients/entities/patient.model";
import { Calendar } from "../../calendar/entities/calendar.model";
export declare class Appointment {
    id: number;
    slot_datetime: Calendar;
    motivo: string;
    estado_id: number;
    doctor_id: number;
    doctor: Doctor;
    patient_id: number;
    patient: Patient;
    status: AppointmentStatus;
}
