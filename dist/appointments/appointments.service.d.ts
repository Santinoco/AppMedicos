import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";
export declare class AppointmentsService {
    private appointmentRepository;
    constructor(appointmentRepository: Repository<Appointment>);
    getAllAppointments(): Promise<Appointment[]>;
    getAppointmentById(id: number): Promise<Appointment | null>;
    createAppointment(appointmentData: any): Promise<Appointment[]>;
    updateAppointmentStatus(id: number, newStatus: number): Promise<Appointment | null>;
}
