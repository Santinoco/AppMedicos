import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
  } from "@nestjs/common";
  import { AppointmentStatusService } from "./appointment-status.service";
  
  @Controller("appointment-statuses")
  export class AppointmentStatusController {
    constructor(private readonly statusService: AppointmentStatusService) {}
  
    @Get()
    async getAllStatuses() {
      return this.statusService.getAllStatuses();
    }
  
    @Get(":status_id")
    async getStatusById(@Param("status_id", ParseIntPipe) status_id: number) {
      return this.statusService.getStatusById(status_id);
    }
  
    @Post()
    async createStatus(@Body() statusData: any) {
      return this.statusService.createStatus(statusData);
    }
  }