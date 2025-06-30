import { DoctorsService } from "./doctors.service";
export declare class DoctorsController {
    private readonly doctorService;
    constructor(doctorService: DoctorsService);
    getAllDoctors(): Promise<import("./entities/doctor.model").Doctor[]>;
    getAllDoctorsLimit(page?: number, limit?: number): Promise<{
        data: import("./entities/doctor.model").Doctor[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
            has_next_page: boolean;
            has_previous_page: boolean;
        };
    }>;
    getDoctorById(user_id: number): Promise<import("./entities/doctor.model").Doctor | null>;
    createDoctor(doctorData: any): Promise<import("./entities/doctor.model").Doctor[]>;
    updateDoctor(user_id: number, updateData: any): Promise<import("./entities/doctor.model").Doctor>;
    deleteDoctor(user_id: number): Promise<{
        message: string;
    }>;
    getDoctorsBySpecialty(specialty: string): Promise<import("./entities/doctor.model").Doctor[]>;
    getDoctorsByName(nombre: string): Promise<import("./entities/doctor.model").Doctor[]>;
    getDoctorsByNameLimit(nombre: string, page?: number, limit?: number): Promise<{
        data: import("./entities/doctor.model").Doctor[];
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
