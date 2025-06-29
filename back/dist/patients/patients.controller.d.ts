import { PatientService } from "./patients.service";
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    getAllPatients(page?: number, limit?: number): Promise<{
        data: import("./entities/patient.model").Patient[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getPatientById(user_id: number): Promise<import("./entities/patient.model").Patient | null>;
    createPatient(patientData: any): Promise<import("./entities/patient.model").Patient[]>;
    updatePatient(user_id: number, updateData: any): Promise<import("./entities/patient.model").Patient>;
    deletePatient(user_id: number): Promise<{
        message: string;
    }>;
    getPatientsByName(nombre: string, page?: number, limit?: number): Promise<{
        data: import("./entities/patient.model").Patient[];
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
