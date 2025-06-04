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

const misTurnosInicial: Turno[] = [
  {
    id: 1,
    nombre: "Juan Perez",
    email: "juan@mail.com",
    motivo: "Fiebre",
    fechaTurno: new Date("2025-05-29T10:30:00"),
    especialidad: "Neurología",
  },
  {
    id: 2,
    nombre: "Maria Gomez",
    email: "maria@mail.com",
    motivo: "Control",
    fechaTurno: new Date("2025-05-29T11:00:00"),
    especialidad: "Pediatría",
  },
];

export default function misTurnos() {
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(misTurnosInicial);

  const cancelarTurno = (id: number) => {
    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del medico
    //y la nueva lista de turnos a tomar
    //por ahora solo actualizo el estado local

    const turnoCancelado = misTurnos.find((turno) => turno.id === id);
    if (turnoCancelado) {
      const nuevaLista = misTurnos.filter((turno) => turno.id !== id);
      setMisTurnos(nuevaLista);

      const nuevaBase = turnosBase.filter((turno) => turno.id !== id);
      setTurnosBase(nuevaBase);
    }
  };

  const filtrarLista = (especialidad: string) => {
    if (especialidad === "Todas") {
      setMisTurnos(turnosBase);
    } else {
      const turnosFiltrados = turnosBase.filter(
        (turno) => turno.especialidad === especialidad
      );
      setMisTurnos(turnosFiltrados);
    }
  };

  return (
    <section id="misTurnos" className="flex-1 mx-2 flex flex-col items-center ">
      <h1 className="text-3xl">Tus Turnos</h1>
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
      <ul>
        {misTurnos.map((misTurnos) => (
          <li key={misTurnos.id}>
            <div className="container flex flex-col bg-white my-4 p-4 rounded-md">
              <div>
                <span className="font-bold">{misTurnos.nombre}</span>{" "}
                <span className="text-gray-500 font-light">
                  - {misTurnos.email}
                </span>
              </div>
              <div className="my-2">
                <span className="font-bold">Fecha:</span>
                <span className="mx-1">
                  {misTurnos.fechaTurno.getHours()}:
                  {misTurnos.fechaTurno.getMinutes()}
                </span>
                <span className="mx-1">
                  {misTurnos.fechaTurno.getDate()}/
                  {misTurnos.fechaTurno.getMonth() + 1}
                </span>
              </div>
              <div className="my-2">
                <span className="font-bold">Especialidad: </span>
                <span>{misTurnos.especialidad}</span>
              </div>
              <div className="mb-2">
                <div className="font-bold">Motivo de consulta:</div>
                <p>{misTurnos.motivo}</p>
              </div>
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
    </section>
  );
}
