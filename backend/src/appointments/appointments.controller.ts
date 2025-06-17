import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Patch,
  } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAllAppointments() {
    return this.appointmentsService.getAllAppointments();
  }

  @Get(":id")
  async getAppointmentById(@Param("id", ParseIntPipe) id: number) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Post()
  async createAppointment(@Body() appointmentData: any) {
    return this.appointmentsService.createAppointment(appointmentData);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('estado') newStatus: number,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, newStatus);
  }
  
}
