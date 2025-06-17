import { UserTypeService } from './user-type.service';
import { UserType } from './entities/user-type.model';
export declare class UserTypeController {
    private readonly userTypeService;
    constructor(userTypeService: UserTypeService);
    create(data: Partial<UserType>): Promise<UserType>;
    findAll(): Promise<UserType[]>;
    findOne(id: string): Promise<UserType>;
    update(id: string, data: Partial<UserType>): Promise<UserType>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
