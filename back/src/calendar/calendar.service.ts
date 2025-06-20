// src/calendar/calendar.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.model';
import { Repository } from 'typeorm';
import { addMinutes, isWeekend, setHours, setMinutes } from 'date-fns';
import { Appointment } from 'src/appointments/entities/appointment.model';
import { Doctor } from 'src/doctors/entities/doctor.model';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly slotRepository: Repository<Calendar>,
    @InjectRepository(Appointment)
    private readonly appointment: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async generateSlots(): Promise<void> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const startHour = 10;
    const endHour = 20;
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
      const slot = new Calendar();
      slot.slot_datetime = slotDate;
      return slot;
    });

    await this.slotRepository.upsert(slotEntities, ['slot_datetime']); 
  }

  async getSlots(): Promise<Calendar[]> {
    return this.slotRepository.find({ order: { slot_id: "ASC" } });
  }

  async getAppointmentsForDoctor(doctorUserId: number) {
    return await this.appointment
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot_datetime', 'calendar')
      .leftJoinAndSelect('appointment.patient_id', 'patient')
      .leftJoinAndSelect('appointment.status', 'status')
      .where('appointment.doctor_id = :doctorUserId', { doctorUserId })
      .getMany();
  }

  async getAvailableSlotsForDoctor(doctorUserId: number) {
    const appointments = await this.getAppointmentsForDoctor(doctorUserId);
    const occupiedSlotIds = appointments.map(a => a.slot_datetime.slot_id);
  
    const doctor = await this.doctorRepository.findOne({ where: { user_id: doctorUserId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
  
    const shiftStart = doctor.shift_start; 
    const shiftEnd = doctor.shift_end;     
    const notIn = occupiedSlotIds.length > 0 ? occupiedSlotIds : [0];
  
    const qb = this.slotRepository
      .createQueryBuilder('calendar')
      .where('calendar.slot_id NOT IN (:...notIn)', { notIn });
  
    if (shiftStart < shiftEnd) {
      qb.andWhere("TO_CHAR(calendar.slot_datetime, 'HH24:MI') BETWEEN :shiftStart AND :shiftEnd", {
        shiftStart, shiftEnd
      });
    } else {
      qb.andWhere(
        "TO_CHAR(calendar.slot_datetime AT TIME ZONE 'UTC' AT TIME ZONE :timezone, 'HH24:MI') BETWEEN :shiftStart AND :shiftEnd",
        { timezone: 'America/Argentina/Buenos_Aires', shiftStart: doctor.shift_start, shiftEnd: doctor.shift_end }
      );
    }
    return qb.getMany();
  }
  

}
