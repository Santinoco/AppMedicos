import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";
import { DoctorsService } from "../doctors/doctors.service";
import { PatientService } from "../patients/patients.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private doctorService: DoctorsService,
    private patientService: PatientService,
  ) {}

  async getAllUsers() {
    try {
      return this.userRepository.find({ order: { id: "ASC" }});
    } catch (error) {
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  }

  async getUserById(id: number) {
    try {
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to retrieve user with id ${id}: ${error.message}`);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);
      const userTypeId = userData.type?.id || userData.type;
      switch (userTypeId) {
        case 2:
          await this.doctorService.createDoctor({ user_id: savedUser.id });
          break;
        case 5:
          await this.patientService.createPatient({ user_id: savedUser.id });
          break;
      }
      return savedUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserAppoinments(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ["appointments"],
      });
      return {
        user,
        message: `Citas del usuario con id: ${id}`,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve appointments for user with id ${id}: ${error.message}`);
    }
  }

  async updateUser(id: number, updateData: Partial<User>) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      Object.assign(user, updateData);
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to update user with id ${id}: ${error.message}`);
    }
  }

  async deleteUser(id: number) {
    try {
      const result = await this.userRepository.delete({id});
      if (result.affected === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { message: `User deleted succesfully` };
    } catch (error) {
      throw new Error(`Failed to delete user with id ${id}: ${error.message}`);
    }
  }

  async findByEmailWithType(email: string) {
    try {
      return this.userRepository.findOne({
          where: { email },
          relations: ['type'],
      });
    } catch (error) {
      throw new Error(`Failed to find user by email ${email}: ${error.message}`);
    }
  }

async findUsersByName(nombre: string) {
  try {
    const users = await this.userRepository.find({ where: { nombre } });
    if (!users || users.length === 0) {
      throw new NotFoundException(`No se encontraron usuarios con el nombre ${nombre}`);
    }
    return users;
  } catch (error) {
    throw new Error(`Failed to find users by name ${nombre}: ${error.message}`);
  }
}

}

