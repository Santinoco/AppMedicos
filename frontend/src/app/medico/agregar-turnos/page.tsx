"use client";

import { useState } from "react";

interface Turno {
  id: number;
  nombre: string;
  email: string;
  motivo: string;
  fechaTurno: Date;
  especialidad: string;
}

const nuevosTurnosInicial: Turno[] = [
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos@mail.com",
    motivo: "Dolor de cabeza",
    fechaTurno: new Date("2025-05-29T11:30:00"),
    especialidad: "Neurología",
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    email: "lucia@mail.com",
    motivo: "Chequeo general",
    fechaTurno: new Date("2025-06-29T12:00:00"),
    especialidad: "Pediatría",
  },
  {
    id: 5,
    nombre: "Diego López",
    email: "diego@mail.com",
    motivo: "Vacunación",
    fechaTurno: new Date("2025-05-29T12:30:00"),
    especialidad: "Pediatría",
  },
];

export default function agregarTurnos() {
  const [nuevosTurnos, setNuevosTurnos] =
    useState<Turno[]>(nuevosTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(nuevosTurnosInicial);

  const tomarTurno = (id: number) => {
    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del medico
    //y la nueva lista de turnos a tomar
    //por ahora solo actualizo el estado local

    const turnoTomado = nuevosTurnos.find((turno) => turno.id === id);
    if (turnoTomado) {
      const nuevaLista = nuevosTurnos.filter((turno) => turno.id !== id);
      setNuevosTurnos(nuevaLista);
      const nuevaBase = turnosBase.filter((turno) => turno.id !== id);
      setTurnosBase(nuevaBase);
    }
  };

  const filtrarLista = (especialidad: string) => {
    if (especialidad === "Todas") {
      setNuevosTurnos(turnosBase);
    } else {
      const turnosFiltrados = turnosBase.filter(
        (turno) => turno.especialidad === especialidad
      );
      setNuevosTurnos(turnosFiltrados);
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6">
      <section id="nuevosTurnos" className=" mx-2 flex flex-col items-center ">
        <h1 className="text-3xl">Nuevos Turnos</h1>
        <div className="mb-4">
          <label htmlFor="especialidad" className="mr-2">
            Filtrar por Especialidad:
          </label>
          <select
            id="especialidad"
            onChange={(e) => filtrarLista(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="Todas">Todas</option>
            <option value="Neurología">Neurología</option>
            <option value="Pediatría">Pediatría</option>
          </select>
        </div>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📅 Turnos agendados</h2>
        {nuevosTurnos.length === 0 ? (
          <p className="text-gray-500">No tenés turnos agendados.</p>
        ) : (
          <ul className="space-y-4">
            {nuevosTurnos.map((nuevoTurno) => (
              <li
                className="border p-4 rounded-lg flex justify-between items-start"
                key={nuevoTurno.id}
              >
                <div>
                  <div>
                    <span className="font-bold">{nuevoTurno.nombre}</span>{" "}
                    <span className="text-gray-500 font-light">
                      - {nuevoTurno.email}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Fecha:</span>
                    📅{" "}
                    {new Intl.DateTimeFormat("es-ES", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(nuevoTurno.fechaTurno)}
                  </div>
                  <div className="mb-1">
                    <span className="font-bold">Especialidad requerida: </span>
                    <span>{nuevoTurno.especialidad}</span>
                  </div>
                  <div className="mb-1">
                    <div className="font-bold">Motivo de consulta:</div>
                    <p>{nuevoTurno.motivo}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => tomarTurno(nuevoTurno.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Tomar Turno
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
