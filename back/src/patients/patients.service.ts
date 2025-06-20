import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";
import { Appointment } from "src/appointments/entities/appointment.model";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
  ) {}

  async getAllPatients() {
    return this.patientRepository.find({ relations: ["user"], order: { user_id: "ASC" } });
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
  
    await this.appointmentRepository.delete({ patient: { user_id } });
  
    await this.patientRepository.delete({ user_id });
  
    return { message: "Patient and related appointments deleted successfully" };
  } 
}