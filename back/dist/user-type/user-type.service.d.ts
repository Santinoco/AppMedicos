import { Repository } from 'typeorm';
import { UserType } from './entities/user-type.model';
export declare class UserTypeService {
    private readonly userTypeRepository;
    constructor(userTypeRepository: Repository<UserType>);
    create(data: Partial<UserType>): Promise<UserType>;
    findAll(): Promise<UserType[]>;
    findOne(id: number): Promise<UserType>;
    update(id: number, data: Partial<UserType>): Promise<UserType>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
