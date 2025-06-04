import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.model";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async getUserAppoinments(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["appointments"],
    });
    return {
      user,
      message: `Citas del usuario con id: ${id}`,
    };
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User with id ${id} not found");
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({id});
    if (result.affected === 0) {
      throw new NotFoundException("User with id ${id} not found");
    }
    return { message: `User deleted succesfully` };
  }

}
