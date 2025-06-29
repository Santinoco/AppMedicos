import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";
import { Appointment } from "../appointments/entities/appointment.model";
export declare class PatientService {
    private patientRepository;
    private appointmentRepository;
    constructor(patientRepository: Repository<Patient>, appointmentRepository: Repository<Appointment>);
    getAllPatients(page?: number, limit?: number): Promise<{
        data: Patient[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getPatientById(user_id: number): Promise<Patient | null>;
    createPatient(patientData: any): Promise<Patient[]>;
    updatePatient(user_id: number, updateData: Partial<Patient>): Promise<Patient>;
    deletePatient(user_id: number): Promise<{
        message: string;
    }>;
    getPatientByName(name: string, page?: number, limit?: number): Promise<{
        data: Patient[];
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
