import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.model';
export declare class AppointmentsService {
    private appointmentRepo;
    constructor(appointmentRepo: Repository<Appointment>);
    findByDoctorId(doctorUserId: number): Promise<Appointment[]>;
    findByPatientId(patientUserId: number): Promise<Appointment[]>;
}
