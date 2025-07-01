"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../../../services/guardService";
import { getPatientById } from "../../../../services/patientService";
import {
  cancelAppointment,
  getAppointmentsByDoctorName,
  getPatientAppointments,
} from "../../../../services/appointmentService";
import { Paciente } from "../../../../types/Paciente";

interface Turno {
  id: number;
  nombre: string;
  email: string;
  fechaTurno: Date;
  motivo: string;
  estado: number;
}

export default function AdminUserView() {
  const router = useRouter();
  // La id del parametro se utilizara para realizar el get usuario by id
  const params = useParams();
  const idUsuario = params.id;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verificarAcceso = async () => {
      const esAdmin = verificarTipoUsuario("administrator");
      if (!esAdmin) {
        // Redirige al usuario si no es administrador
        router.push("/");
      } else {
        setIsVerified(true); // Marca como verificado si es administrador
      }
    };

    verificarAcceso();
  }, [router]);

  useEffect(() => {
    if (!isVerified || !idUsuario) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [pacienteData, turnosData] = await Promise.all([
          getPatientById(idUsuario as string),
          getPatientAppointments(idUsuario as string),
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

        setTurnos(turnosData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError(
          "No se pudieron cargar los datos. Intente de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isVerified, idUsuario]);

  const cancelarTurno = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      try {
        await cancelAppointment(id);

        // Actualiza el estado del turno en la lista local
        setTurnos((prevTurnos) =>
          prevTurnos.map((t) => (t.id === id ? { ...t, estado: 3 } : t))
        );

        alert(`Turno con ID ${id} cancelado.`);
      } catch (error) {
        console.error("Error al cancelar el turno:", error);
        alert("No se pudo cancelar el turno. Inténtalo más tarde.");
      }
    }
  };

  const filtrarPorNombre = async (nombre: string) => {
    if (!idUsuario) return;

    try {
      if (nombre.trim() === "") {
        const allTurnos = await getPatientAppointments(idUsuario as string);
        setTurnos(allTurnos);
      } else {
        const turnosFiltrados = await getAppointmentsByDoctorName(
          nombre,
          idUsuario as string
        );
        setTurnos(turnosFiltrados);
      }
    } catch (err) {
      console.error("Error al filtrar turnos:", err);
      setError("No se pudo realizar la búsqueda. Intente de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-gray-500 text-xl">Cargando datos del paciente...</p>
      </main>
    );
  }

  if (error || !paciente) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-red-500 text-xl">
          {error || "Paciente no encontrado."}
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-1 p-10 space-y-6">
        <div className="flex">
          <h1 className="text-3xl font-bold text-green-800">
            Informacion del usuario
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
          >
            Volver
          </button>
        </div>
        <div>
          <span className="text-3xl font-bold text-black">
            {paciente.usuario.nombre} {paciente.usuario.apellido}
          </span>
          <span className="text-gray-500 font-light">
            {" "}
            - {paciente.usuario.email}
          </span>
        </div>
        <p>
          <span className="font-bold mr-1">Id: </span>
          {paciente.usuario.id}
        </p>
        <p>
          <span className="font-bold mr-1">Tipo de usuario:</span>
          <span>Paciente</span>
        </p>
        <p>
          <span className="font-bold mr-1">Actividad:</span>
          {paciente.usuario.activo ? (
            <strong className="text-green-600 ml-1">Activo</strong>
          ) : (
            <strong className="text-red-700 ml-1">Inactivo</strong>
          )}
        </p>

        <div className="space-y-6">
          <p>
            <span className="font-bold mr-1">Consultas completadas:</span>
            {paciente.consultasCompletadas}
          </p>
          <p>
            <span className="font-bold mr-1">Seguro Medico:</span>
            {paciente.seguroMedico}
          </p>
          <p>
            <span className="font-bold mr-1">Historial Medico:</span>
            {paciente.historialMedico}
          </p>
          <p>
            <span className="font-bold mr-1">Peso:</span> {paciente.peso}
          </p>
          <p>
            <span className="font-bold mr-1">Altura:</span> {paciente.altura}
          </p>
          <p>
            <span className="font-bold mr-1">Tipo de sangre:</span>
            {paciente.tipoSangre}
          </p>
        </div>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📅 Turnos agendados</h2>
          <div className="my-4">
            <label htmlFor="nombre" className="mr-2">
              Filtrar:
            </label>
            <input
              type="text"
              id="nombre"
              placeholder="Ingrese un nombre"
              onChange={(e) => filtrarPorNombre(e.target.value)}
              className="border border-gray-300 rounded p-2"
            />
          </div>
          {turnos.length === 0 ? (
            <p className="text-gray-500">No tenés turnos agendados.</p>
          ) : (
            <ul className="space-y-4">
              {turnos.map((turno) => (
                <li
                  className="border p-4 rounded-lg flex justify-between items-start"
                  key={turno.id}
                >
                  <div>
                    <div>
                      <span className="font-bold mr-2">Medico:</span>
                      <span>{turno.nombre}</span>{" "}
                      <span className="text-gray-500 font-light">
                        - {turno.email}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold mr-1">Fecha:</span>
                      📅{" "}
                      {new Intl.DateTimeFormat("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(turno.fechaTurno)}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold">Estado: </span>
                      {turno.estado === 1 ? (
                        <span>Pendiente</span>
                      ) : turno.estado === 2 ? (
                        <span>Completado</span>
                      ) : turno.estado === 3 ? (
                        <span>Cancelado</span>
                      ) : turno.estado === 4 ? (
                        <span>Reprogramado</span>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <div className="mb-1">
                      <div className="font-bold">Motivo de consulta:</div>
                      <p>{turno.motivo}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    {turno.estado !== 2 && turno.estado !== 3 && (
                      <button
                        onClick={() => cancelarTurno(turno.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancelar Turno
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
