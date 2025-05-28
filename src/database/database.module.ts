import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.model";
import { Appointment } from "../appointments/entities/appointment.model";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432, // Puerto correcto para PostgreSQL
      username: "root",
      password: "password",
      database: "appmedicos",
      entities: [User, Appointment],
      synchronize: true, // Ten cuidado con esto en producción
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
