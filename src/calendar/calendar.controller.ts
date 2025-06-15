import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Post("generateslots")
    async generateSlots() {
        return this.calendarService.generateSlots();
    }

    @Get("getslots")
    async getSlots() {
        return this.calendarService.getSlots();
    }

    @Get('doctor-appointments')
    async getDoctorAppointments(@Query('doctorUserId', ParseIntPipe) doctorUserId: number) {
      return this.calendarService.getAppointmentsForDoctor(doctorUserId);
    }

    @Get('doctor-available-slots')
    async getDoctorAvailableSlots(@Query('doctorUserId', ParseIntPipe) doctorUserId: number) {
      return this.calendarService.getAvailableSlotsForDoctor(doctorUserId);
    }

    
  } 


