"use client";
import { useEffect, useState } from "react";
import { getUserId } from "../../../services/userService";
import { Turno } from "../../../types/Turno";
import { useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../../services/guardService";
import {
  getDoctorAppointments,
  cancelAppointment,
  getAppointmentsByPatientName,
} from "../../../services/appointmentService";

export default function misTurnos() {
  const router = useRouter();
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);
  const [turnosBase, setTurnosBase] = useState<Turno[]>([]);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState<string | null>(null); // Estado para errores

  useEffect(() => {
    const verificarAcceso = async () => {
      const esMedico = verificarTipoUsuario("doctor");
      if (!esMedico) {
        // Redirige al usuario si no es medico
        router.push("/");
      } else {
        setIsVerified(true); // Marca como verificado si es medico
      }
    };

    verificarAcceso();
  }, [router]);

  useEffect(() => {
    if (isVerified) {
      fetchTurnos();
    }
  }, [isVerified]);

  const fetchTurnos = async () => {
    const userId = getUserId();
    if (!userId) {
      setError(
        "No se pudo obtener la información del usuario. Por favor, inicie sesión de nuevo."
      );
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const turnosData = await getDoctorAppointments(userId);
      setMisTurnos(turnosData);
      setTurnosBase(turnosData);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      setError(
        "No se pudieron cargar los turnos. Inténtelo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarTurno = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      try {
        await cancelAppointment(id);
        fetchTurnos(); // Actualizar la lista de turnos después de cancelar
        alert(`Turno con ID ${id} cancelado.`);
      } catch (error) {
        console.error("Error al cancelar el turno:", error);
        alert("No se pudo cancelar el turno. Inténtalo más tarde.");
      }
    }
  };

  const filtrarPorNombre = async (nombre: string) => {
    const userId = getUserId();
    if (!userId) return;

    if (nombre.trim() === "") {
      setMisTurnos(turnosBase);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        const turnosFiltrados = await getAppointmentsByPatientName(
          nombre,
          userId
        );
        setMisTurnos(turnosFiltrados);
      } catch (error) {
        console.error("Error al filtrar los turnos:", error);
        setError("No se pudo realizar la búsqueda. Inténtelo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6">
      <section id="misTurnos" className=" mx-2 flex flex-col items-center ">
        <h1 className="text-3xl">Mis Turnos</h1>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              mostrarPendientes
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={mostrarPendientes}
            onClick={() => setMostrarPendientes(true)}
          >
            Pendientes
          </button>
          <button
            className={`py-2 px-4 rounded ${
              !mostrarPendientes
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={!mostrarPendientes}
            onClick={() => setMostrarPendientes(false)}
          >
            Historial
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4">
          📅 {mostrarPendientes ? "Turnos Pendientes" : "Historial de Turnos"}
        </h2>
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

        {isLoading ? (
          <p className="text-gray-500">Cargando turnos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : misTurnos.filter((turno) =>
            mostrarPendientes
              ? turno.estado === 1
              : turno.estado === 2 || turno.estado === 3
          ).length === 0 ? (
          <p className="text-gray-500">
            No hay turnos para mostrar en esta sección.
          </p>
        ) : (
          <ul className="space-y-4">
            {misTurnos
              .filter((turno) =>
                mostrarPendientes
                  ? turno.estado === 1
                  : turno.estado === 2 || turno.estado === 3
              )
              .map((turno) => (
                <li
                  className="border p-4 rounded-lg flex justify-between items-start"
                  key={turno.id}
                >
                  <div>
                    <div className="mb-1">
                      <span className="font-bold">{turno.nombre}</span>{" "}
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
                    {mostrarPendientes && (
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
    </div>
  );
}
