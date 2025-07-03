"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPatientById } from "../../services/patientService";
import { getNextPendingAppointmentForPatient } from "../../services/appointmentService";
import { getUserId } from "../../services/userService";
import { verificarTipoUsuario } from "../../services/guardService";
import { Paciente } from "../../types/Paciente";
import { Turno } from "../../types/Turno";

export default function PacienteInicio() {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [proximoTurno, setProximoTurno] = useState<Turno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verificarAcceso = () => {
      const esPaciente = verificarTipoUsuario("patient");
      if (!esPaciente) {
        router.push("/");
      } else {
        setIsVerified(true);
      }
    };
    verificarAcceso();
  }, [router]);

  const fetchData = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setError("No se pudo obtener la información del usuario.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [pacienteData, turnoData] = await Promise.all([
        getPatientById(userId),
        getNextPendingAppointmentForPatient(userId),
      ]);

      setPaciente({
        consultasCompletadas: pacienteData.completed_consultations,
        seguroMedico: pacienteData.health_insurance,
        historialMedico: pacienteData.medical_history,
        peso: pacienteData.weight,
        altura: pacienteData.height,
        tipoSangre: pacienteData.blood_type,
        usuario: pacienteData.user,
      });

      setProximoTurno(turnoData);
    } catch (err) {
      console.error("Error al obtener datos del paciente:", err);
      setError("No se pudieron cargar los datos. Intente de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVerified) {
      fetchData();
    }
  }, [isVerified, fetchData]);

  if (isLoading) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-gray-500 text-xl">Cargando datos...</p>
      </main>
    );
  }

  if (error || !paciente) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-red-500 text-xl">
          {error || "No se pudieron cargar los datos del paciente."}
        </p>
      </main>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, {paciente.usuario.nombre}
      </h1>
      <p>👤 Apellido: {paciente.usuario.apellido}</p>
      <p>📧 Email: {paciente.usuario.email}</p>
      <p>🏥 Obra social: {paciente.seguroMedico ?? "-"}</p>
      <p>⚕️ Historia médica: {paciente.historialMedico ?? "-"}</p>
      <p>⚖️ Peso: {paciente.peso ?? "-"} kg</p>
      <p>📏 Altura: {paciente.altura ?? "-"} cm</p>
      <p>🩸 Grupo sanguíneo: {paciente.tipoSangre ?? "-"}</p>
      <p>✅ Consultas completadas: {paciente.consultasCompletadas ?? "-"}</p>

      <section className="bg-green-50 p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          📌 Próximo turno
        </h3>
        {proximoTurno ? (
          <div>
            <div className="mb-1">
              <span className="font-bold">{proximoTurno.nombre}</span>{" "}
              <span className="text-gray-500 font-light">
                - {proximoTurno.email}
              </span>
            </div>
            <div className="mb-1">
              <span className="font-bold mr-1">Fecha:</span> 📅{" "}
              {proximoTurno.fechaTurno.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              🕒{" "}
              {proximoTurno.fechaTurno.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="mb-1">
              <div className="font-bold">Motivo de consulta:</div>
              <p>{proximoTurno.motivo}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No hay turnos futuros pendientes.</p>
        )}
      </section>
    </>
  );
}
