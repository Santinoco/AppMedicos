import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";
import { DoctorsService } from "src/doctors/doctors.service";
import { PatientService } from "src/patients/patients.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private doctorService: DoctorsService,
    private patientService: PatientService,
  ) {}

  async getAllUsers() {
    return this.userRepository.find({ order: { id: "ASC" }  });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
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

  async findByEmailWithType(email: string) {
    return this.userRepository.findOne({
        where: { email },
        relations: ['type'],
    });
}

}
