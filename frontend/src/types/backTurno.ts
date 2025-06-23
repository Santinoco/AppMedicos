import { BackMedico } from "./backMedico";
import { BackPaciente } from "./backPaciente";
import { BackUser } from "./backUser";

export interface BackTurno {
  id: number;
  slot_datetime: Calendar;
  motivo: string;
  estado_id: number;
  doctor_id: BackMedico;
  doctor: BackUser;
  patient_id: BackPaciente;
  patient: BackUser;
  status: Status;
}

interface Calendar {
  slot_id: number;
  slot_datetime: Date;
  appointments: BackTurno[];
}

interface Status {
  status_id: number; // 1 Pendiente, 2 Completado, 3 Cancelado, 4 Reprogramado
  status: string;
}
