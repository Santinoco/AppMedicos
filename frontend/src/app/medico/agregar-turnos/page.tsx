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
    <section
      id="nuevosTurnos"
      className="flex-1 mx-2 flex flex-col items-center"
    >
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
      <ul>
        {nuevosTurnos.map((nuevoTurno) => (
          <li key={nuevoTurno.id}>
            <div className="container flex flex-col bg-white my-4 p-4 rounded-md">
              <div>
                <span className="font-bold">{nuevoTurno.nombre}</span>{" "}
                <span className="text-gray-500 font-light">
                  - {nuevoTurno.email}
                </span>
              </div>
              <div className="my-2">
                <span className="font-bold">Fecha:</span>
                <span className="mx-1">
                  {nuevoTurno.fechaTurno.getHours()}:
                  {nuevoTurno.fechaTurno.getMinutes()}
                </span>
                <span className="mx-1">
                  {nuevoTurno.fechaTurno.getDate()}/
                  {nuevoTurno.fechaTurno.getMonth() + 1}
                </span>
              </div>
              <div className="my-2">
                <span className="font-bold">Especialidad: </span>
                <span>{nuevoTurno.especialidad}</span>
              </div>
              <div className="mb-2">
                <div className="font-bold">Motivo de consulta:</div>
                <p>{nuevoTurno.motivo}</p>
              </div>
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
    </section>
  );
}
