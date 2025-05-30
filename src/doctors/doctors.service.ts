import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async getAllDoctors() {
    return this.doctorRepository.find({ relations: ["user"] });
  }

  async getDoctorById(user_id: number) {
    return this.doctorRepository.findOne({
      where: { user_id },
      relations: ["user"],
    });
  }

  async createDoctor(doctorData: any) {
    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  async updateDoctor(user_id: number, updateData: Partial<Doctor>) {
    const doctor = await this.doctorRepository.findOne({ where: { user_id } });
    if (!doctor) throw new NotFoundException(`Doctor with user_id ${user_id} not found`);
    Object.assign(doctor, updateData);
    return this.doctorRepository.save(doctor);
  }

  async deleteDoctor(user_id: number) {
    const result = await this.doctorRepository.delete({user_id});
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with user_id ${user_id} not found`);
    }
    return { message: "Doctor deleted successfully" };
  }

}