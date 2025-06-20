import { Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
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


