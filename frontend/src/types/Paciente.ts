import { Usuario } from "./Usuario";

export interface Paciente {
  consultasCompletadas: number;
  seguroMedico: string;
  historialMedico: string;
  peso: number;
  altura: number;
  tipoSangre: string;
  usuario: Usuario;
}
