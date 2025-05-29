import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";
export declare class DoctorsService {
    private doctorRepository;
    constructor(doctorRepository: Repository<Doctor>);
    getAllDoctors(): Promise<Doctor[]>;
    getDoctorById(user_id: number): Promise<Doctor | null>;
    createDoctor(doctorData: any): Promise<Doctor[]>;
}
