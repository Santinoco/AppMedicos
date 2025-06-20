export class CreateAppointmentDto {

    readonly motivo: string;
  
    readonly slot_datetime: Date;
  
    readonly doctor_id: number;
  
    readonly patient_id: number;

    readonly status_id: number;
  
  }