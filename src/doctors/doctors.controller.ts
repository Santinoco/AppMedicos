import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Patch,
    Delete,
  } from "@nestjs/common";
  import { DoctorsService } from "./doctors.service";
  
  @Controller("doctors")
  export class DoctorsController {
    constructor(private readonly doctorService: DoctorsService) {}
  
    @Get()
    async getAllDoctors() {
      return this.doctorService.getAllDoctors();
    }
  
    @Get(":user_id")
    async getDoctorById(@Param("user_id", ParseIntPipe) user_id: number) {
      return this.doctorService.getDoctorById(user_id);
    }
  
    @Post()
    async createDoctor(@Body() doctorData: any) {
      return this.doctorService.createDoctor(doctorData);
    }

    @Patch(":user_id")
    async updateDoctor(
      @Param('user_id', ParseIntPipe) user_id: number,
      @Body() updateData: any
    ) {
      return this.doctorService.updateDoctor(user_id, updateData);
    }

    @Delete(":user_id")
    async deleteDoctor(
      @Param('user_id', ParseIntPipe) user_id: number
    ) {
      return this.doctorService.deleteDoctor(user_id);
    }

  }