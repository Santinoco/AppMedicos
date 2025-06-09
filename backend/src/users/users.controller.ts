import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUsers() {
       return this.userService.getAllUsers();
    }
    
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }
    
    @Post()
    async createUser(@Body() userData: any) {
        return this.userService.createUser(userData);
    }
    
    @Get(':id/appoinments')
    async getUserAppoinments(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserAppoinments(id);
    }
}
