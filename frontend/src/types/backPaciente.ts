import { BackTurno } from "./backTurno";
import { BackUser } from "./backUser";

export interface BackPaciente {
  user_id: number;
  user: BackUser;
  completed_consultations: number;
  health_insurance: string;
  medical_history: string;
  weight: number;
  height: number;
  blood_type: string;
}
