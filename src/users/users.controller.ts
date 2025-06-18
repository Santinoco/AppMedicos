import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(":id")
  async getUserById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  /*@Post()
  async createUser(@Body() userData: any) {
    return this.userService.createUser(userData);
  }*/

  @Get(":id/appointments")
  async getUserAppoinments(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUserAppoinments(id);
  }

  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: any,
  ) {
    return this.userService.updateUser(id, updateData);
  }

  @Delete(":id")
  async deleteUser(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.userService.deleteUser(id);
  }

}
