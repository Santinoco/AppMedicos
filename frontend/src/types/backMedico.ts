import { BackTurno } from "./backTurno";
import { BackUser } from "./backUser";

export interface BackMedico {
  user_id: number;
  user: BackUser;
  specialty: string;
  shift_start: string;
  shift_end: string;
  license_number: number;
  active: boolean;
  appointments: BackTurno[];
}
