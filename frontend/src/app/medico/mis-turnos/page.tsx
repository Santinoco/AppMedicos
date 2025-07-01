"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getUserId } from "../../../services/userIdService";
import { BackTurno } from "../../../types/backTurno";
import { Turno } from "../../../types/Turno";
import { useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../../services/guardService";
import { toast } from 'sonner';
const misTurnosInicial: Turno[] = [
  {
    id: 0,
    nombre: "",
    email: "",
    motivo: "",
    fechaTurno: new Date("0001-01-01T10:00:00"),
    estado: 0,
  },
];

export default function misTurnos() {
  const router = useRouter();
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(misTurnosInicial);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [nombreBusqueda, setNombreBusqueda] = useState("");

  useEffect(() => {
    const verificarAcceso = async () => {
      const esMedico = verificarTipoUsuario("doctor");
      if (!esMedico) router.push("/");
      else setIsVerified(true);
    };
    verificarAcceso();
  }, [router]);

  useEffect(() => {
    if (isVerified) fetchTurnos();
  }, [isVerified]);

  const fetchTurnos = async () => {
    const token = localStorage.getItem("access_token") || "";
    const userId = getUserId();
    try {
      const responseTurnos = await axios.get(
        `http://localhost:3000/appointments/doctor/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const turnosData: Turno[] = responseTurnos.data.map((turno: BackTurno) => ({
        id: turno.id,
        nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
        email: turno.patient.user.email,
        motivo: turno.motivo,
        fechaTurno: new Date(turno.slot_datetime.slot_datetime),
        estado: turno.status.status_id,
      }));

      setMisTurnos(turnosData);
      setTurnosBase(turnosData);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
      toast.error('No se pudo obtener los turnos. Intentalo mas tarde')
    }
  };
/*Cancelar turno */
  const cancelarTurno = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      try {
        await axios.patch(
          `http://localhost:3000/appointments/${id}/status`,
          { estado: 3 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTurnos();
          toast.info(`Turno cancelado`);
      } catch (error) {
        console.error("Error al cancelar el turno:", error);
        toast.error("No se pudo cancelar el turno. Inténtalo más tarde.");
      }
    }
  };
/*Filtrado de turnos */
  const filtrarPorNombre = async (nombre: string) => {
    const token = localStorage.getItem("access_token");
    const userId = getUserId();
    if (nombre.trim() === "") {
      setMisTurnos(turnosBase);
    } else {
      const responseFiltrado = await axios.get(
        `http://localhost:3000/appointments/appointments-by-patient-name/${nombre}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const turnosFiltrados: Turno[] = responseFiltrado.data
        .filter((turno: BackTurno) => turno.doctor.user_id === userId)
        .map((turno: BackTurno) => ({
          id: turno.id,
          nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
          email: turno.patient.user.email,
          motivo: turno.motivo,
          fechaTurno: new Date(turno.slot_datetime.slot_datetime),
          estado: turno.status.status_id,
        }));

      setMisTurnos(turnosFiltrados);
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6">
      <button
        onClick={() => router.push("/medico")}
        className="absolute top-9 left-72 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a inicio
      </button>

      <section className="mx-2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Mis Turnos</h1>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              mostrarPendientes ? "bg-green-600 text-white cursor-default" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={mostrarPendientes}
            onClick={() => setMostrarPendientes(true)}
          >
            Pendientes
          </button>
          <button
            className={`py-2 px-4 rounded ${
              !mostrarPendientes ? "bg-green-600 text-white cursor-default" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={!mostrarPendientes}
            onClick={() => setMostrarPendientes(false)}
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

        {misTurnos.length === 0 ? (
          <p className="text-gray-500">No tenés turnos pendientes.</p>
        ) : (
          <ul className="space-y-4">
            {misTurnos
              .filter((turno) =>
                mostrarPendientes ? turno.estado === 1 : turno.estado === 2 || turno.estado === 3
              )
              .map((turno) => (
                <li
                  className="border p-4 rounded-lg flex justify-between items-start"
                  key={turno.id}
                >
                  <div>
                    <div className="mb-1">
                      <span className="font-bold">{turno.nombre}</span>{" "}
                      <span className="text-gray-500 font-light">- {turno.email}</span>
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
                      {turno.estado === 1
                        ? "Pendiente"
                        : turno.estado === 2
                        ? "Completado"
                        : turno.estado === 3
                        ? "Cancelado"
                        : turno.estado === 4
                        ? "Reprogramado"
                        : ""}
                    </div>
                    <div className="mb-1">
                      <div className="font-bold">Motivo de consulta:</div>
                      <p>{turno.motivo}</p>
                    </div>
                  </div>
                  {mostrarPendientes && (
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => cancelarTurno(turno.id)}
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
    </div>
  );
}
