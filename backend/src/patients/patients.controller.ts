import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
  } from "@nestjs/common";
  import { PatientService } from "./patients.service";
  
  @Controller("patients")
  export class PatientController {
    constructor(private readonly patientService: PatientService) {}
  
    @Get()
    async getAllPatients() {
      return this.patientService.getAllPatients();
    }
  
    @Get(":user_id")
    async getPatientById(@Param("user_id", ParseIntPipe) user_id: number) {
      return this.patientService.getPatientById(user_id);
    }
  
    @Post()
    async createPatient(@Body() patientData: any) {
      return this.patientService.createPatient(patientData);
    }
  }