import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";
import { Appointment } from "../appointments/entities/appointment.model";
export declare class PatientService {
    private patientRepository;
    private appointmentRepository;
    constructor(patientRepository: Repository<Patient>, appointmentRepository: Repository<Appointment>);
    getAllPatients(): Promise<Patient[]>;
    getAllPatientsLimit(page?: number, limit?: number): Promise<{
        data: Patient[];
        pagination: {
            current_page: number;
            total_pages: number;
            total_items: number;
            items_per_page: number;
            has_next_page: boolean;
            has_previous_page: boolean;
        };
    }>;
    getPatientById(user_id: number): Promise<Patient | null>;
    createPatient(patientData: any): Promise<Patient[]>;
    updatePatient(user_id: number, updateData: Partial<Patient>): Promise<Patient>;
    deletePatient(user_id: number): Promise<{
        message: string;
    }>;
    getPatientByName(name: string): Promise<Patient[]>;
    getPatientByNameLimit(name: string, page?: number, limit?: number): Promise<{
        data: Patient[];
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
