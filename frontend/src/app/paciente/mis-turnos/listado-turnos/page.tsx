"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserId } from "../../../../services/userService";
import { getPatientAppointments } from "../../../../services/appointmentService";
import { Turno } from "../../../../types/Turno";

export default function ListadoTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurnos = useCallback(async () => {
    const patientId = getUserId();

    if (!patientId) {
      setError("No se pudo identificar al usuario.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const turnosData = await getPatientAppointments(patientId);
      setTurnos(turnosData);
    } catch (err) {
      console.error("Error al traer los turnos:", err);
      setError("No se pudieron cargar los turnos. Intente de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Pendiente";
      case 2:
        return "Completado";
      case 3:
        return "Cancelado";
      case 4:
        return "Reprogramado";
      default:
        return "Desconocido";
    }
  };

  if (isLoading) return <p className="text-center mt-10">Cargando turnos...</p>;

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (turnos.length === 0)
    return <p className="text-center mt-10">No hay turnos agendados.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Mis turnos</h2>
      <div className="grid gap-6">
        {turnos.map((turno) => (
          <div
            key={turno.id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
          >
            <p className="text-lg font-semibold text-gray-800">
              🩺 Doctor: {turno.nombre}
            </p>
            <p className="text-gray-700">
              📅 Fecha:{" "}
              {new Intl.DateTimeFormat("es-ES", {
                dateStyle: "medium",
              }).format(new Date(turno.fechaTurno))}
            </p>

            <p className="text-gray-700">
              🕒 Hora:{" "}
              {new Intl.DateTimeFormat("es-ES", {
                timeStyle: "short",
              }).format(new Date(turno.fechaTurno))}{" "}
              hs
            </p>
            <p className="text-gray-700">📌 Motivo: {turno.motivo}</p>
            <p className="text-gray-700">
              📍 Estado: {getStatusText(turno.estado)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
