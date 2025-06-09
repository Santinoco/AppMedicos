import { UserService } from './user.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): {
        message: string;
    };
}
