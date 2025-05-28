import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.model';
import { Appointment } from '../appointments/entities/appointment.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'appmedicos',
      models: [User, Appointment],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
