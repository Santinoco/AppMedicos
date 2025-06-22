import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";
import { Appointment } from "../appointments/entities/appointment.model";
export declare class DoctorsService {
    private doctorRepository;
    private appointmentRepository;
    constructor(doctorRepository: Repository<Doctor>, appointmentRepository: Repository<Appointment>);
    getAllDoctors(): Promise<Doctor[]>;
    getDoctorById(user_id: number): Promise<Doctor | null>;
    createDoctor(doctorData: any): Promise<Doctor[]>;
    updateDoctor(user_id: number, updateData: Partial<Doctor>): Promise<Doctor>;
    deleteDoctor(user_id: number): Promise<{
        message: string;
    }>;
}
