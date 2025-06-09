// src/calendar/calendar.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarSlot } from './entities/calendar.model';
import { Repository } from 'typeorm';
import { addMinutes, isWeekend, setHours, setMinutes } from 'date-fns';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarSlot)
    private readonly slotRepository: Repository<CalendarSlot>,
  ) {}

  async generateSlots(): Promise<void> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const startHour = 10;
    const endHour = 19;
    const intervalMinutes = 30;

    const slots: Date[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (isWeekend(d)) continue;

      for (
        let hour = startHour;
        hour < endHour;
        hour++
      ) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
          const slot = new Date(d);
          slot.setHours(hour, minute, 0, 0);

          if (slot >= startDate && slot <= endDate) {
            slots.push(new Date(slot));
          }
        }
      }
    }

    const slotEntities = slots.map((slotDate) => {
      const slot = new CalendarSlot();
      slot.slotDatetime = slotDate;
      return slot;
    });

    await this.slotRepository.upsert(slotEntities, ['slotDatetime']); // evita duplicados
  }

}
