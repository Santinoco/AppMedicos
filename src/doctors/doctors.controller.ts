import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
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
  }