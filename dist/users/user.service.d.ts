import { Repository } from "typeorm";
import { User } from "./entities/user.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";
export declare class UserService {
    private userRepository;
    private doctorRepository;
    private patientRepository;
    constructor(userRepository: Repository<User>, doctorRepository: Repository<Doctor>, patientRepository: Repository<Patient>);
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser(userData: Partial<User>): Promise<User>;
    getUserAppoinments(id: number): Promise<{
        user: User | null;
        message: string;
    }>;
    updateUser(id: number, updateData: Partial<User>): Promise<User>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
