import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    // Asegúrate de que userData.type sea el id del tipo de usuario o carga el tipo si es necesario
    const userTypeId = userData.type?.id || userData.type;
    switch (userTypeId) {
      case 2:
        const doctor = this.doctorRepository.create({ user_id: savedUser.id });
        await this.doctorRepository.save(doctor);
        break;
      case 5:
        const patient = this.patientRepository.create({ user_id: savedUser.id });
        await this.patientRepository.save(patient);
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

}
