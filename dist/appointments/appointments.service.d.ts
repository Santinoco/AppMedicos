import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";
import { CreateAppointmentDto } from "./dto/calendar.dto";
import { Calendar } from "./../calendar/entities/calendar.model";
export declare class AppointmentsService {
    private appointmentRepository;
    private calendarRepository;
    constructor(appointmentRepository: Repository<Appointment>, calendarRepository: Repository<Calendar>);
    getAllAppointments(): Promise<Appointment[]>;
    getAppointmentById(id: number): Promise<Appointment | null>;
    createAppointment(dto: CreateAppointmentDto): Promise<Appointment>;
    updateAppointmentStatus(id: number, newStatus: number): Promise<Appointment | null>;
}
