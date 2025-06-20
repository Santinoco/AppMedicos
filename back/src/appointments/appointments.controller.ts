import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
    Delete,
  } from "@nestjs/common";
  import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
  import { AppointmentsService } from "./appointments.service";
import { RolesGuard } from "src/auth/roles/roles.guard";
import { Roles } from "src/auth/roles/roles.decorator";

@Controller("appointments")
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get('doctor/:doctor_id')
  async getAppointmentsByDoctorId(@Param('doctor_id', ParseIntPipe) doctor_id: number) {
    return this.appointmentsService.findByDoctorId(doctor_id);
  }

  @Get('patient/:patient_id')
  async getAppointmentsByPatientId(@Param('patient_id', ParseIntPipe) patient_id: number) {
    return this.appointmentsService.findByPatientId(patient_id);
  }

  @Delete(':id')
  @Roles("administrator")
  async deleteAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.deleteAppointment(id);
  }
  
}
