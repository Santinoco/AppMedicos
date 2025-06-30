import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";
import { Appointment } from "../appointments/entities/appointment.model";
export declare class DoctorsService {
    private doctorRepository;
    private appointmentRepository;
    constructor(doctorRepository: Repository<Doctor>, appointmentRepository: Repository<Appointment>);
    getAllDoctors(): Promise<Doctor[]>;
    getAllDoctorsLimit(page?: number, limit?: number): Promise<{
        data: Doctor[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
            has_next_page: boolean;
            has_previous_page: boolean;
        };
    }>;
    getDoctorById(user_id: number): Promise<Doctor | null>;
    createDoctor(doctorData: any): Promise<Doctor[]>;
    updateDoctor(user_id: number, updateData: Partial<Doctor>): Promise<Doctor>;
    deleteDoctor(user_id: number): Promise<{
        message: string;
    }>;
    getDoctorBySpeciality(specialty: string): Promise<Doctor[]>;
    getDoctorByName(name: string): Promise<Doctor[]>;
    getDoctorByNameLimit(name: string, page?: number, limit?: number): Promise<{
        data: Doctor[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
            has_next_page: boolean;
            has_previous_page: boolean;
        };
    }>;
}
