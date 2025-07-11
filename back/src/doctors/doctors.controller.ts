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
    Query,
  } from "@nestjs/common";
  import { DoctorsService } from "./doctors.service";
  import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
  import { RolesGuard } from "../auth/roles/roles.guard";
  import { Roles } from "../auth/roles/roles.decorator";
  
  @Controller("doctors")
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class DoctorsController {
    constructor(private readonly doctorService: DoctorsService) {}
  
    @Get()
    async getAllDoctors() {
      const docs = await this.doctorService.getAllDoctors();
      return docs;
    }

    @Get("limit")
    async getAllDoctorsLimit(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
      return this.doctorService.getAllDoctorsLimit(Number(page), Number(limit));
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

    @Get("specialty/:specialty")
    async getDoctorsBySpecialty(@Param("specialty") specialty: string) {
      return this.doctorService.getDoctorBySpeciality(specialty);
    }

    @Get("by-name/:nombre")
    async getDoctorsByName(@Param("nombre") nombre: string) {
      return this.doctorService.getDoctorByName(nombre);
    }

    @Get("limit/by-name/:nombre")
    async getDoctorsByNameLimit(@Param("nombre") nombre: string, @Query('page') page: number = 1, @Query('limit') limit: number = 5) {
      return this.doctorService.getDoctorByNameLimit(nombre, Number(page), Number(limit));
    }

  }