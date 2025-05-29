import { UserService } from "./user.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import("./entities/user.model").User[]>;
    getUserById(id: number): Promise<import("./entities/user.model").User | null>;
    createUser(userData: any): Promise<import("./entities/user.model").User[]>;
    getUserAppoinments(id: number): Promise<{
        user: import("./entities/user.model").User | null;
        message: string;
    }>;
    updateUser(id: number, updateData: any): Promise<import("./entities/user.model").User>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
