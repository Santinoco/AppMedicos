import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.model";
import { CreateAppointmentDto } from "./dto/calendar.dto";
import { Calendar } from "./../calendar/entities/calendar.model";
export declare class AppointmentsService {
    private appointmentRepository;
    private calendarRepository;
    constructor(appointmentRepository: Repository<Appointment>, calendarRepository: Repository<Calendar>);
    getAllAppointments(): Promise<Appointment[]>;
    getAppointmentById(id: number): Promise<Appointment>;
    createAppointment(dto: CreateAppointmentDto): Promise<Appointment>;
    updateAppointmentStatus(id: number, newStatus: number): Promise<Appointment>;
    findByDoctorId(doctorUserId: number): Promise<Appointment[]>;
    findByPatientId(patientUserId: number): Promise<Appointment[]>;
    deleteAppointment(id: number): Promise<string>;
    getAppointmentsByPatientName(name: string): Promise<Appointment[]>;
    getAppointmentsByDate(date: Date): Promise<Appointment[]>;
}
