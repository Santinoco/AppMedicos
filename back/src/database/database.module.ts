import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.model";
import { Appointment } from "../appointments/entities/appointment.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";
import { AppointmentStatus } from "src/appointment-statuses/entities/appointment-status.model";
import { UserType } from "src/user-type/entities/user-type.model";
import { Calendar } from "src/calendar/entities/calendar.model";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "appmedicos",
      entities: [User, Appointment, Doctor, Patient, AppointmentStatus, UserType, Calendar], // Agregar cada nueva entidad acá
      synchronize: false, // Tener cuidado con esto en producción porque puede borrar la info de la base de datos
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
