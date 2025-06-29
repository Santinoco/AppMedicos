import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";
import { Appointment } from "../appointments/entities/appointment.model";
export declare class DoctorsService {
    private doctorRepository;
    private appointmentRepository;
    constructor(doctorRepository: Repository<Doctor>, appointmentRepository: Repository<Appointment>);
    getAllDoctors(page?: number, limit?: number): Promise<{
        data: Doctor[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getDoctorById(user_id: number): Promise<Doctor | null>;
    createDoctor(doctorData: any): Promise<Doctor[]>;
    updateDoctor(user_id: number, updateData: Partial<Doctor>): Promise<Doctor>;
    deleteDoctor(user_id: number): Promise<{
        message: string;
    }>;
    getDoctorBySpeciality(specialty: string): Promise<Doctor[]>;
    getDoctorByName(name: string, page?: number, limit?: number): Promise<{
        data: Doctor[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
}
