import api from "./api";

export interface UpdatePatientData {
  health_insurance?: string;
  weight?: number;
  height?: number;
  blood_type?: string;
  medical_history?: string;
}

/**
 * Actualiza los datos de un paciente por su ID.
 */
export const updatePatient = async (
  patientId: number,
  data: UpdatePatientData
): Promise<void> => {
  await api.patch(`/patients/${patientId}`, data);
};
