import { Calendar } from './entities/calendar.model';
import { Repository } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.model';
import { Doctor } from 'src/doctors/entities/doctor.model';
export declare class CalendarService {
    private readonly slotRepository;
    private readonly appointment;
    private readonly doctorRepository;
    constructor(slotRepository: Repository<Calendar>, appointment: Repository<Appointment>, doctorRepository: Repository<Doctor>);
    generateSlots(): Promise<void>;
    getSlots(): Promise<Calendar[]>;
    getAppointmentsForDoctor(doctorUserId: number): Promise<Appointment[]>;
    getAvailableSlotsForDoctor(doctorUserId: number): Promise<Calendar[]>;
}
