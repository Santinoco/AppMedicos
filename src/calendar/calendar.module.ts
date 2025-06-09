// src/calendar/calendar.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarSlot } from './entities/calendar-slot.entity';
import { CalendarService } from './calendar.service';
import { CalendarController  } from './calendar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarSlot])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
