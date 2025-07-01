import { Usuario } from "./Usuario";

export interface Medico {
  especialidad: string;
  matricula: number;
  comienzoJornada: string;
  finJornada: string;
  usuario: Usuario;
}
