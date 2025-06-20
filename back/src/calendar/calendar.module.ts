// src/calendar/calendar.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.model';
import { CalendarService } from './calendar.service';
import { CalendarController  } from './calendar.controller';
import { Appointment } from 'src/appointments/entities/appointment.model';
import { Doctor } from 'src/doctors/entities/doctor.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, Appointment, Doctor]), AuthModule],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
