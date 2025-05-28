import { Injectable } from "@nestjs/common";
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
}