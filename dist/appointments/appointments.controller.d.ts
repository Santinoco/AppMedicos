import { AppointmentsService } from "./appointments.service";
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getAllAppointments(): Promise<import("./entities/appointment.model").Appointment[]>;
    getAppointmentById(id: number): Promise<import("./entities/appointment.model").Appointment | null>;
    createAppointment(appointmentData: any): Promise<import("./entities/appointment.model").Appointment[]>;
    updateStatus(id: number, newStatus: number): Promise<import("./entities/appointment.model").Appointment | null>;
}
