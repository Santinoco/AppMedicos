"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserId } from "../../../services/userIdService";
import { BackTurno } from "../../../types/backTurno";
import { Turno } from "../../../types/Turno";

const misTurnosInicial: Turno[] = [
  {
    id: 0,
    nombre: "",
    email: "",
    motivo: "",
    fechaTurno: new Date("0001-01-01T10:00:00"),
  },
];

export default function misTurnos() {
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(misTurnosInicial);
  // Obtener el ID del usuario logueado
  const userId = getUserId();

  useEffect(() => {
    const fetchTurnos = async () => {
      const token = localStorage.getItem("access_token");
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
            nombre: `${turno.patient.nombre} ${turno.patient.apellido}`,
            email: turno.patient.email,
            motivo: turno.motivo,
            fechaTurno: new Date(turno.slot_datetime.slot_datetime),
          })
        );

        setMisTurnos(turnosData);
        setTurnosBase(turnosData);
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      }
    };
    fetchTurnos();
  }, [userId]);

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

          const nuevaLista = misTurnos.filter((turno) => turno.id !== id);
          setMisTurnos(nuevaLista);

          const nuevaBase = turnosBase.filter((turno) => turno.id !== id);
          setTurnosBase(nuevaBase);
          alert(`Turno con ID ${id} cancelado.`);
        } catch (error) {
          console.error("Error al cancelar el turno:", error);
          alert("No se pudo cancelar el turno. Inténtalo más tarde.");
        }
      }
    }
  };

  const filtrarPorNombre = (nombre: string) => {
    if (nombre.trim() === "") {
      setMisTurnos(turnosBase);
    } else {
      const turnosFiltrados = turnosBase.filter((turno) =>
        turno.nombre.toLowerCase().includes(nombre.toLowerCase().trim())
      );
      setMisTurnos(turnosFiltrados);
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6">
      <section id="misTurnos" className=" mx-2 flex flex-col items-center ">
        <h1 className="text-3xl">Mis Turnos</h1>
        <div className="my-4">
          <label htmlFor="nombre" className="mr-2">
            Filtrar por Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese un nombre"
            onChange={(e) => filtrarPorNombre(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📅 Turnos agendados</h2>
        {misTurnos.length === 0 ? (
          <p className="text-gray-500">No tenés turnos agendados.</p>
        ) : (
          <ul className="space-y-4">
            {misTurnos
              .slice() // Crear una copia del array para no modificar el estado original
              .sort((a, b) => a.fechaTurno.getTime() - b.fechaTurno.getTime()) //Ordeno por fecha antes de mostrar
              .map((misTurnos) => (
                <li
                  className="border p-4 rounded-lg flex justify-between items-start"
                  key={misTurnos.id}
                >
                  <div>
                    <div className="mb-1">
                      <span className="font-bold">{misTurnos.nombre}</span>{" "}
                      <span className="text-gray-500 font-light">
                        - {misTurnos.email}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold mr-1">Fecha:</span>
                      📅{" "}
                      {new Intl.DateTimeFormat("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(misTurnos.fechaTurno)}
                    </div>

                    <div className="mb-1">
                      <div className="font-bold">Motivo de consulta:</div>
                      <p>{misTurnos.motivo}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => cancelarTurno(misTurnos.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancelar Turno
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
