import { DoctorsService } from "./doctors.service";
export declare class DoctorsController {
    private readonly doctorService;
    constructor(doctorService: DoctorsService);
    getAllDoctors(): Promise<import("./entities/doctor.model").Doctor[]>;
    getDoctorById(user_id: number): Promise<import("./entities/doctor.model").Doctor | null>;
    createDoctor(doctorData: any): Promise<import("./entities/doctor.model").Doctor[]>;
    updateDoctor(user_id: number, updateData: any): Promise<import("./entities/doctor.model").Doctor>;
    deleteDoctor(user_id: number): Promise<{
        message: string;
    }>;
}
