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
import { toast } from "sonner";

export default function misTurnos() {
  const router = useRouter();
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);
  const [turnosBase, setTurnosBase] = useState<Turno[]>([]);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState<string | null>(null); // Estado para errores
  const [nombreBusqueda, setNombreBusqueda] = useState("");

  // Estado para el modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(
    null
  );

  useEffect(() => {
    const verificarAcceso = async () => {
      const esMedico = verificarTipoUsuario("doctor");
      if (!esMedico) router.push("/");
      else setIsVerified(true);
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
      toast.error("No se pudo obtener los turnos. Intentalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarCancelacion = (id: number) => {
    setTurnoSeleccionado(id);
    setMostrarModal(true);
  };

  const cancelarTurno = async (id: number) => {
    try {
      await cancelAppointment(id);
      setMostrarModal(false);
      setTurnoSeleccionado(null);
      fetchTurnos(); // Actualizar la lista de turnos después de cancelar
      toast.success("Turno cancelado");
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
      toast.error("No se pudo cancelar el turno. Inténtalo más tarde.");
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
    <div className="flex-1 p-10 space-y-6 relative">
      {/* Botón volver */}
      <button
        onClick={() => router.push("/medico")}
        className="absolute top-9 left-10 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a inicio
      </button>

      <section className="mx-2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Mis Turnos
        </h1>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        {/* Filtros */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${mostrarPendientes
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setMostrarPendientes(true)}
            disabled={mostrarPendientes}
          >
            Pendientes
          </button>
          <button
            className={`py-2 px-4 rounded ${!mostrarPendientes
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setMostrarPendientes(false)}
            disabled={!mostrarPendientes}
          >
            Historial
          </button>
        </div>

        <div className="my-4 flex items-center gap-4">
          <label htmlFor="nombre">Filtrar:</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese un nombre"
            value={nombreBusqueda}
            onChange={(e) => {
              const value = e.target.value;
              setNombreBusqueda(value);
              filtrarPorNombre(value);
            }}
            className="border border-gray-300 rounded p-2"
          />
          <button
            onClick={() => {
              setNombreBusqueda("");
              setMisTurnos(turnosBase);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
          >
            Limpiar
          </button>
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
                    <div className="mb-1 font-bold">
                      {turno.nombre}{" "}
                      <span className="text-gray-500 font-light">
                        - {turno.email}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold mr-1">Fecha:</span> 📅{" "}
                      {new Intl.DateTimeFormat("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(turno.fechaTurno)}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold">Estado: </span>
                      {turno.estado === 1
                        ? "Pendiente"
                        : turno.estado === 2
                          ? "Completado"
                          : turno.estado === 3
                            ? "Cancelado"
                            : "Otro"}
                    </div>
                    <div className="mb-1">
                      <div className="font-bold">Motivo de consulta:</div>
                      <p>{turno.motivo}</p>
                    </div>
                  </div>
                  {mostrarPendientes && (
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => confirmarCancelacion(turno.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancelar Turno
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </section>

      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-300">
            <p className="text-gray-800 text-lg mb-6 text-center">
              ¿Estás seguro de que deseas cancelar este turno?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => cancelarTurno(turnoSeleccionado)}
                className="px-4 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md"
              >
                Confirmar
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
