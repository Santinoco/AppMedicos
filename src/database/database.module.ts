import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.model";
import { Appointment } from "../appointments/entities/appointment.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432, // Puerto correcto para PostgreSQL
      username: "postgres",
      password: "admin",
      database: "appmedicos",
      entities: [User, Appointment, Doctor, Patient], // Agregar cada nueva entidad acá
      synchronize: true, // Ten cuidado con esto en producción
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
