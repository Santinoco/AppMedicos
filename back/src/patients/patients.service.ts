import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./entities/patient.model";
import { Appointment } from "../appointments/entities/appointment.model";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>
  ) {}

  async getAllPatients() {
    try {
      return this.patientRepository.find({ relations: ["user"], order: { user_id: "ASC" } });
    } catch (error) {
      throw new Error(`Failed to retrieve patients: ${error.message}`);
    }
  }

  async getAllPatientsLimit(page: number = 1, limit: number = 5) {
    try {
      const skip = (page - 1) * limit;
      
      const [patients, total] = await this.patientRepository.findAndCount({
        relations: ["user"],
        order: { user_id: "ASC" },
        skip,
        take: limit
      });

      const total_pages = Math.ceil(total / limit);

      return {
        data: patients,
        pagination: {
          current_page: page,
          total_pages,
          total_items: total,
          items_per_page: limit,
          has_next_page: page < total_pages,
          has_previous_page: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to retrieve patients: ${error.message}`);
    }
  }

  async getPatientById(user_id: number) {
    try {
      return this.patientRepository.findOne({
        where: { user_id },
        relations: ["user"],
      });
    } catch (error) {
      throw new Error(`Failed to retrieve patient with user_id ${user_id}: ${error.message}`);
    }
  }

  async createPatient(patientData: any) {
    try {
      const patient = this.patientRepository.create(patientData);
      return this.patientRepository.save(patient);
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }

  async updatePatient(user_id: number, updateData: Partial<Patient>) {
    try {
      const patient = await this.patientRepository.findOne({ where: { user_id } });
      if (!patient) {
        throw new NotFoundException(`Patient with user_id ${user_id} not found`);
      }
      Object.assign(patient, updateData);
      return this.patientRepository.save(patient);
    } catch (error) {
      throw new Error(`Failed to update patient with user_id ${user_id}: ${error.message}`);
    }
  }

  async deletePatient(user_id: number) {
    try {
      const patient = await this.patientRepository.findOne({ where: { user_id } });
      if (!patient) {
        throw new NotFoundException(`Patient with user_id ${user_id} not found`);
      }
      await this.appointmentRepository.delete({ patient: { user_id } });
      await this.patientRepository.delete({ user_id });
      return { message: "Patient and related appointments deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete patient with user_id ${user_id}: ${error.message}`);
    }
  }

  async getPatientByName(name: string) {
    try {
      const patients = await this.patientRepository.find({
        where: {
          user: { nombre: name },
        },
        relations: ["user"],
        order: { user_id: "ASC" },
      });
      return patients;
    } catch (error) {
      throw new Error(`Failed to retrieve patients by name ${name}: ${error.message}`);
    }
  }

  async getPatientByNameLimit(name: string, page: number = 1, limit: number = 5) {
    try {
      const skip = (page - 1) * limit;
      
      const [patients, total] = await this.patientRepository.findAndCount({
        where: {
          user: { nombre: name },
        },
        relations: ["user"],
        order: { user_id: "ASC" },
        skip,
        take: limit
      });

      const total_pages = Math.ceil(total / limit);

      return {
        data: patients,
        pagination: {
          current_page: page,
          total_pages,
          total_items: total,
          items_per_page: limit,
          has_next_page: page < total_pages,
          has_previous_page: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to retrieve patients by name ${name}: ${error.message}`);
    }
  }
}