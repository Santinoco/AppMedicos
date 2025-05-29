import { Repository } from "typeorm";
import { User } from "./entities/user.model";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser(userData: any): Promise<User[]>;
    getUserAppoinments(id: number): Promise<{
        user: User | null;
        message: string;
    }>;
    updateUser(id: number, updateData: Partial<User>): Promise<User>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
