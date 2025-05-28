// src/patients/patient.service.ts
import { Injectable } from "@nestjs/common";
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
}