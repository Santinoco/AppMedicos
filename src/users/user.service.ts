import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
   getAllUsers() {
    return {
        message: 'Get all users',
    };
   }
   getUserById(id: number) {
    return {
        message: `Get user by id: ${id}`,
    };
   }
   createUser() {
    return {
        message: 'Create user',
    };
   }
}