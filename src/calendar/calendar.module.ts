// src/calendar/calendar.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.model';
import { CalendarService } from './calendar.service';
import { CalendarController  } from './calendar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
