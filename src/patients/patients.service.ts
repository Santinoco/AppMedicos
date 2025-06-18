import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getAllPatients() {
    return this.patientRepository.find({ relations: ["user"] });
  }

  async getPatientById(user_id: number) {
    return this.patientRepository.findOne({
      where: { user_id },
      relations: ["user"],
    });
  }

  async createPatient(patientData: any) {
    const patient = this.patientRepository.create(patientData);
    return this.patientRepository.save(patient);
  }

  async updatePatient(user_id: number, updateData: Partial<Patient>) {
    const patient = await this.patientRepository.findOne({ where: { user_id } });

    if (!patient) {
      throw new NotFoundException(`Patient with user_id ${user_id} not found`);
    }

    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  async deletePatient(user_id: number) {
    const patient = await this.patientRepository.findOne({ where: { user_id } });

    if (!patient) {
      throw new NotFoundException(`Patient with user_id ${user_id} not found`);
    }

    await this.patientRepository.delete(user_id);
    return { message: "Patient deleted successfully" };
  }
}