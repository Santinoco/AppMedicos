import { BackTurno } from "../types/backTurno";
import { Turno } from "../types/Turno";
import api from "./api";

/**
 * Mapea la respuesta del backend a la estructura que usa el frontend (vista de médico).
 */
const mapBackTurnoToTurnoForDoctorView = (turno: BackTurno): Turno => ({
  id: turno.id,
  nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
  email: turno.patient?.user?.email || "No especificado",
  motivo: turno.motivo,
  fechaTurno: new Date(turno.slot_datetime.slot_datetime),
  estado: turno.status.status_id,
});

/**
 * Mapea la respuesta del backend a la estructura que usa el frontend (vista de paciente).
 */
const mapBackTurnoToTurnoForPatientView = (turno: BackTurno): Turno => ({
  id: turno.id,
  nombre: `${turno.doctor.user.nombre} ${turno.doctor.user.apellido}`,
  email: turno.doctor?.user?.email || "No especificado",
  motivo: turno.motivo,
  fechaTurno: new Date(turno.slot_datetime.slot_datetime),
  estado: turno.status.status_id,
});

/**
 * Obtiene todos los turnos asignados a un doctor específico.
 */
export const getDoctorAppointments = async (
  doctorId: string
): Promise<Turno[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/doctor/${doctorId}`
  );
  return response.data.map(mapBackTurnoToTurnoForDoctorView);
};

/**
 * Obtiene todos los turnos asignados a un paciente específico.
 */
export const getPatientAppointments = async (
  patientId: string
): Promise<Turno[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/patient/${patientId}`
  );
  return response.data.map(mapBackTurnoToTurnoForPatientView);
};

/**
 * Cancela un turno por su ID.
 */
export const cancelAppointment = async (
  appointmentId: number
): Promise<void> => {
  await api.patch(`/appointments/${appointmentId}/status`, { estado: 3 });
};

/**
 * Filtra los turnos de un doctor por el nombre del paciente.
 */
export const getAppointmentsByPatientName = async (
  patientName: string,
  doctorId: string
): Promise<Turno[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/appointments-by-patient-name/${patientName}`
  );

  const numericDoctorId = parseInt(doctorId, 10);
  if (isNaN(numericDoctorId)) {
    console.error("ID de doctor inválido:", doctorId);
    return []; // Devuelve un array vacío si el ID no es válido
  }

  // El backend devuelve todos los turnos que coinciden con el nombre,
  // así que filtro para mostrar solo los del doctor actual.
  return response.data
    .filter((turno) => turno.doctor && turno.doctor.user_id === numericDoctorId)
    .map(mapBackTurnoToTurnoForDoctorView);
};

/**
 * Filtra los turnos de un paciente por el nombre del doctor.
 */
export const getAppointmentsByDoctorName = async (
  doctorName: string,
  patientId: string
): Promise<Turno[]> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/appointments-by-doctor-name/${doctorName}`
  );

  const numericPatientId = parseInt(patientId, 10);
  if (isNaN(numericPatientId)) {
    console.error("ID de paciente inválido:", patientId);
    return [];
  }

  return response.data
    .filter(
      (turno) => turno.patient && turno.patient.user_id === numericPatientId
    )
    .map(mapBackTurnoToTurnoForPatientView);
};

/**
 * Obtiene el próximo turno pendiente para un doctor.
 */
export const getNextPendingAppointment = async (
  doctorId: string
): Promise<Turno | null> => {
  const response = await api.get<BackTurno[]>(
    `/appointments/doctor/${doctorId}`
  );
  // El backend ya devuelve los turnos ordenados por fecha.
  // Busco el primer turno que tenga el estado "pendiente" (ID 1).
  const nextAppointment = response.data.find(
    (turno) => turno.status.status_id === 1
  );

  if (nextAppointment) {
    return mapBackTurnoToTurnoForDoctorView(nextAppointment);
  }

  return null;
};
