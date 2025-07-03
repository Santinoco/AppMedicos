import api from "./api";
import { BackTurno } from "../types/backTurno";
import { Paciente } from "../types/Paciente";
import { BackMedico } from "../types/backMedico";
import { PaginatedResponse } from "../types/PaginatedResponse";

export interface UpdateDoctorData {
  specialty?: string;
  shift_start?: string;
  shift_end?: string;
}
// Obtiene todos los doctores del sistema y devuelve un array de objetos BackMedico.
export const getAllDoctors = async (): Promise<BackMedico[]> => {
  const response = await api.get<BackMedico[]>("/doctors");
  return response.data;
};

/**
 * Obtiene los datos de un doctor por su ID de usuario.
 */
export const getDoctorById = async (doctorId: string): Promise<BackMedico> => {
  const response = await api.get<BackMedico>(`/doctors/${doctorId}`);
  return response.data;
};

/**
 * Extrae una lista de pacientes únicos a partir de una lista de turnos.
 */
const mapTurnosToUniquePacientes = (turnos: BackTurno[]): Paciente[] => {
  const pacientesData: Paciente[] = [];
  const pacienteIds = new Set<number>();

  turnos.forEach((turno) => {
    if (turno.patient && !pacienteIds.has(turno.patient.user_id)) {
      pacienteIds.add(turno.patient.user_id);
      pacientesData.push({
        consultasCompletadas: turno.patient.completed_consultations,
        seguroMedico: turno.patient.health_insurance,
        historialMedico: turno.patient.medical_history,
        peso: turno.patient.weight,
        altura: turno.patient.height,
        tipoSangre: turno.patient.blood_type,
        usuario: turno.patient.user,
      });
    }
  });
  return pacientesData;
};

/**
 * Obtiene todos los pacientes únicos de un doctor a través de sus turnos.
 */
export const getPatientsByDoctor = async (
  doctorId: string
): Promise<Paciente[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/doctor/${doctorId}`
  );
  return mapTurnosToUniquePacientes(response.data);
};

/**
 * Busca pacientes por nombre (a través de los turnos) y los filtra por doctor.
 */
export const findPatientsByName = async (
  patientName: string,
  doctorId: string
): Promise<Paciente[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/appointments-by-patient-name/${patientName}`
  );
  const doctorTurnos = response.data.filter(
    (turno) => turno.doctor.user_id === parseInt(doctorId, 10)
  );
  return mapTurnosToUniquePacientes(doctorTurnos);
};

/**
 * Actualiza los datos de un doctor.
 */
export const updateDoctor = async (
  doctorId: string,
  data: UpdateDoctorData
): Promise<void> => {
  await api.patch(`/doctors/${doctorId}`, data);
};

/**
 * Obtiene médicos filtrados por nombre.
 * @param name - El nombre a buscar.
 */
export const getDoctorsByName = async (name: string): Promise<BackMedico[]> => {
  const response = await api.get<BackMedico[]>(`/doctors/by-name/${name}`);
  return response.data;
};

/**
 * Obtiene todos los médicos con paginación.
 */
export const getDoctorsPaginated = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<BackMedico>> => {
  const response = await api.get<PaginatedResponse<BackMedico>>(
    `/doctors/limit?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Obtiene médicos filtrados por nombre con paginación.
 */
export const getDoctorsByNamePaginated = async (
  name: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<BackMedico>> => {
  const response = await api.get<PaginatedResponse<BackMedico>>(
    `/doctors/limit/by-name/${name}?page=${page}&limit=${limit}`
  );
  return response.data;
};
