"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserId } from "../../../services/userIdService";
import { BackTurno } from "../../../types/backTurno";
import { Turno } from "../../../types/Turno";
import { useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../../services/guardService";

const misTurnosInicial: Turno[] = [
  {
    id: 0,
    nombre: "",
    email: "",
    motivo: "",
    fechaTurno: new Date("0001-01-01T10:00:00"),
    estado: "",
  },
];

export default function misTurnos() {
  const router = useRouter();
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(misTurnosInicial);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación

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
    // Obtener el ID del usuario logueado
    fetchTurnos();
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
      const turnosData: Turno[] = responseTurnos.data.map(
        (turno: BackTurno) => ({
          id: turno.id,
          nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
          email: turno.patient?.user?.email || "",
          motivo: turno.motivo,
          fechaTurno: new Date(turno.slot_datetime.slot_datetime),
          estado: turno.status.status,
        })
      );

      setMisTurnos(turnosData);
      setTurnosBase(turnosData);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
    }
  };

  const cancelarTurno = async (id: number) => {
    const token = localStorage.getItem("access_token");
    const turnoCancelado = misTurnos.find((turno) => turno.id === id);
    if (confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      if (turnoCancelado) {
        try {
          await axios.patch(
            `http://localhost:3000/appointments/${id}/status`,
            {
              estado: 3, // Cambiar el estado del turno a cancelado
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          fetchTurnos(); // Actualizar la lista de turnos después de cancelar
          alert(`Turno con ID ${id} cancelado.`);
        } catch (error) {
          console.error("Error al cancelar el turno:", error);
          alert("No se pudo cancelar el turno. Inténtalo más tarde.");
        }
      }
    }
  };

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
          estado: turno.status.status,
        }));

      setMisTurnos(turnosFiltrados);
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

        {misTurnos.length === 0 ? (
          <p className="text-gray-500">No tenés turnos pendientes.</p>
        ) : (
          <ul className="space-y-4">
            {misTurnos
              .filter((turno) =>
                mostrarPendientes
                  ? turno.estado === "pending"
                  : turno.estado === "cancelled" ||
                    turno.estado === "rescheduled"
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
                      <span className="font-bold mr-1">Estado:</span>
                      <span>{turno.estado}</span>
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
