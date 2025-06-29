import { PatientService } from "./patients.service";
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    getAllPatients(): Promise<import("./entities/patient.model").Patient[]>;
    getPatientById(user_id: number): Promise<import("./entities/patient.model").Patient | null>;
    createPatient(patientData: any): Promise<import("./entities/patient.model").Patient[]>;
    updatePatient(user_id: number, updateData: any): Promise<import("./entities/patient.model").Patient>;
    deletePatient(user_id: number): Promise<{
        message: string;
    }>;
    getPatientsByName(nombre: string): Promise<import("./entities/patient.model").Patient[]>;
}
