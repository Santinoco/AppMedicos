import { Repository } from "typeorm";
import { User } from "./entities/user.model";
import { DoctorsService } from "src/doctors/doctors.service";
import { PatientService } from "src/patients/patients.service";
export declare class UserService {
    private userRepository;
    private doctorService;
    private patientService;
    constructor(userRepository: Repository<User>, doctorService: DoctorsService, patientService: PatientService);
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
    findByEmailWithType(email: string): Promise<User | null>;
    findUsersByName(nombre: string): Promise<User[]>;
}
