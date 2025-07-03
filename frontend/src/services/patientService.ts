import { BackPaciente } from "../types/backPaciente";
import { PaginatedResponse } from "../types/PaginatedResponse";
import api from "./api";

export interface UpdatePatientData {
  health_insurance?: string;
  weight?: number;
  height?: number;
  blood_type?: string;
  medical_history?: string;
}
// Obtiene todos los pacientes del sistema y devuelve un array de objetos BackPaciente.
export const getAllPatients = async (): Promise<BackPaciente[]> => {
  const response = await api.get<BackPaciente[]>("/patients");
  return response.data;
};

/**
 * Actualiza los datos de un paciente por su ID.
 */
export const updatePatient = async (
  patientId: number,
  data: UpdatePatientData
): Promise<void> => {
  await api.patch(`/patients/${patientId}`, data);
};

/**
 * Obtiene pacientes filtrados por nombre.
 * @param name - El nombre a buscar.
 */
export const getPatientsByName = async (
  name: string
): Promise<BackPaciente[]> => {
  const response = await api.get<BackPaciente[]>(`/patients/by-name/${name}`);
  return response.data;
};

/**
 * Obtiene un paciente por su ID.
 * @param patientId - El ID del paciente.
 */
export const getPatientById = async (
  patientId: string
): Promise<BackPaciente> => {
  const response = await api.get<BackPaciente>(`/patients/${patientId}`);
  return response.data;
};

export const getPatientsPaginated = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<BackPaciente>> => {
  const response = await api.get<PaginatedResponse<BackPaciente>>(
    `/patients/limit?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Obtiene pacientes filtrados por nombre con paginación.
 */
export const getPatientsByNamePaginated = async (
  name: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<BackPaciente>> => {
  const response = await api.get<PaginatedResponse<BackPaciente>>(
    `/patients/limit/by-name/${name}?page=${page}&limit=${limit}`
  );
  return response.data;
};
