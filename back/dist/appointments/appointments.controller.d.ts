import { AppointmentsService } from "./appointments.service";
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getAllAppointments(): Promise<import("./entities/appointment.model").Appointment[]>;
    getAppointmentById(id: number): Promise<import("./entities/appointment.model").Appointment>;
    createAppointment(appointmentData: any): Promise<import("./entities/appointment.model").Appointment>;
    updateStatus(id: number, newStatus: number): Promise<import("./entities/appointment.model").Appointment>;
    getAppointmentsByDoctorId(doctor_id: number): Promise<import("./entities/appointment.model").Appointment[]>;
    getAppointmentsByPatientId(patient_id: number): Promise<import("./entities/appointment.model").Appointment[]>;
    deleteAppointment(id: number): Promise<string>;
    getAppointmentsByName(name: string): Promise<import("./entities/appointment.model").Appointment[]>;
    getAppointmentsByDoctorName(name: string): Promise<import("./entities/appointment.model").Appointment[]>;
    getAppointmentsByDate(date: Date): Promise<import("./entities/appointment.model").Appointment[]>;
}
