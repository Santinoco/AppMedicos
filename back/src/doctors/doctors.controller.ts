import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Patch,
    Delete,
    UseGuards,
  } from "@nestjs/common";
  import { DoctorsService } from "./doctors.service";
  import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
  import { RolesGuard } from "src/auth/roles/roles.guard";
  import { Roles } from "src/auth/roles/roles.decorator";
  
  @Controller("doctors")
  @UseGuards(JwtAuthGuard, RolesGuard)
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
    @Roles("administrator")
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
    @Roles("administrator")
    async deleteDoctor(
      @Param('user_id', ParseIntPipe) user_id: number
    ) {
      return this.doctorService.deleteDoctor(user_id);
    }

  }