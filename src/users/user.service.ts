import { Injectable } from "@nestjs/common";
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

  async createUser(userData: any) {
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
}
