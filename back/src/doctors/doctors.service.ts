import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.model";
import { Appointment } from "../appointments/entities/appointment.model";

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getAllDoctors(page: number = 1, limit: number = 5) {
    try {
      const skip = (page - 1) * limit;
      
      const [doctors, total] = await this.doctorRepository.findAndCount({
        relations: ["user"],
        order: { user_id: "ASC" },
        skip,
        take: limit
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: doctors,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new Error('Error al obtener los médicos: ' + error.message);
    }
  }

  async getDoctorById(user_id: number) {
    try {
      return await this.doctorRepository.findOne({
        where: { user_id },
        relations: ["user"],
      });
    } catch (error) {
      throw new Error('Error al obtener el médico: ' + error.message);
    }
  }

  async createDoctor(doctorData: any) {
    try {
      const doctor = this.doctorRepository.create(doctorData);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new Error('Error al crear el médico: ' + error.message);
    }
  }

  async updateDoctor(user_id: number, updateData: Partial<Doctor>) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { user_id } });
      if (!doctor) throw new NotFoundException(`Doctor with user_id ${user_id} not found`);
      Object.assign(doctor, updateData);
      return await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new Error('Error al actualizar el médico: ' + error.message);
    }
  }

  async deleteDoctor(user_id: number) {
    try {
      await this.appointmentRepository.delete({ doctor_id: user_id });
      const result = await this.doctorRepository.delete({ user_id });
      if (result.affected === 0) {
        throw new NotFoundException(`Doctor with user_id ${user_id} not found`);
      }
      return { message: "Doctor and related appointments deleted successfully" };
    } catch (error) {
      throw new Error('Error al eliminar el médico: ' + error.message);
    }
  }

  async getDoctorBySpeciality(specialty: string) {
    try {
      return await this.doctorRepository.find({
        where: { specialty: specialty },
        relations: ["user"],
      });
    } catch (error) {
      throw new Error('Error al obtener médicos por especialidad: ' + error.message);
    }
  }

  async getDoctorByName(name: string, page: number = 1, limit: number = 5) {
    try {
      const skip = (page - 1) * limit;
      
      const [doctors, total] = await this.doctorRepository.findAndCount({
        where: { user: { nombre: name } },
        relations: ["user"],
        order: { user_id: "ASC" },
        skip,
        take: limit
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: doctors,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw new Error('Error al obtener médicos por nombre: ' + error.message);
    }
  }



}