import { PatientService } from "./patients.service";
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    getAllPatients(): Promise<import("./entities/patient.model").Patient[]>;
    getAllPatientsLimit(page?: number, limit?: number): Promise<{
        data: import("./entities/patient.model").Patient[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
            has_next_page: boolean;
            has_previous_page: boolean;
        };
    }>;
    getPatientById(user_id: number): Promise<import("./entities/patient.model").Patient | null>;
    createPatient(patientData: any): Promise<import("./entities/patient.model").Patient[]>;
    updatePatient(user_id: number, updateData: any): Promise<import("./entities/patient.model").Patient>;
    deletePatient(user_id: number): Promise<{
        message: string;
    }>;
    getPatientsByName(nombre: string): Promise<import("./entities/patient.model").Patient[]>;
    getPatientsByNameLimit(nombre: string, page?: number, limit?: number): Promise<{
        data: import("./entities/patient.model").Patient[];
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
