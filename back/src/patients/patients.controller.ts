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
  import { PatientService } from "./patients.service";
  import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
  import { RolesGuard } from "../auth/roles/roles.guard";
  import { Roles } from "../auth/roles/roles.decorator";
  
  @Controller("patients")
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class PatientController {
    constructor(private readonly patientService: PatientService) {}
  
    @Get()
    async getAllPatients(@Query('page') page: number = 1, @Query('limit') limit: number = 5) {
      return this.patientService.getAllPatients(page, limit);      
    }
  
    @Get(":user_id")
    async getPatientById(@Param("user_id", ParseIntPipe) user_id: number) {
      return this.patientService.getPatientById(user_id);
    }
  
    @Post()
    async createPatient(@Body() patientData: any) {
      return this.patientService.createPatient(patientData);
    }

    @Patch(":user_id")
    async updatePatient(
    @Param("user_id", ParseIntPipe) user_id: number,
    @Body() updateData: any
    ) {
      return this.patientService.updatePatient(user_id, updateData);
    }


    @Delete(":user_id")
    @Roles("administrator")
    async deletePatient(@Param("user_id", ParseIntPipe) user_id: number) {
      return this.patientService.deletePatient(user_id);
    }

    @Get("by-name/:nombre")
  async getPatientsByName(
    @Param("nombre") nombre: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5
  ) {
    return this.patientService.getPatientByName(nombre, Number(page), Number(limit));
  }

  }