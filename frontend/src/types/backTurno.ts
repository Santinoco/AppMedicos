export interface BackTurno {
  id: number;
  slot_datetime: Calendar;
  motivo: string;
  estado_id: number;
  doctor_id: number;
  patient_id: number;
  status: number; // 1 Pendiente, 2 Completado, 3 Cancelado, 4 Reprogramado
}

interface Calendar {
  slot_id: number;
  slot_datetime: Date;
  appointments: BackTurno[];
}
