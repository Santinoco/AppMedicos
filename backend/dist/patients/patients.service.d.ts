import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";
export declare class PatientService {
    private patientRepository;
    constructor(patientRepository: Repository<Patient>);
    getAllPatients(): Promise<Patient[]>;
    getPatientById(user_id: number): Promise<Patient | null>;
    createPatient(patientData: any): Promise<Patient[]>;
}
