"use client";

import { useState } from "react";

interface Turno {
  id: number;
  nombre: string;
  email: string;
  motivo: string;
  fechaTurno: Date;
}

const misTurnosInicial: Turno[] = [
  {
    id: 1,
    nombre: "Juan Perez",
    email: "juan@mail.com",
    motivo: "Fiebre",
    fechaTurno: new Date("2025-05-29T10:30:00"),
  },
  {
    id: 2,
    nombre: "Maria Gomez",
    email: "maria@mail.com",
    motivo: "Control",
    fechaTurno: new Date("2025-05-29T11:00:00"),
  },
];

const nuevosTurnosInicial: Turno[] = [
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos@mail.com",
    motivo: "Dolor de cabeza",
    fechaTurno: new Date("2025-05-29T11:30:00"),
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    email: "lucia@mail.com",
    motivo: "Chequeo general",
    fechaTurno: new Date("2025-06-29T12:00:00"),
  },
  {
    id: 5,
    nombre: "Diego López",
    email: "diego@mail.com",
    motivo: "Vacunación",
    fechaTurno: new Date("2025-05-29T12:30:00"),
  },
];

export default function MedicoDashboard() {
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [nuevosTurnos, setNuevosTurnos] =
    useState<Turno[]>(nuevosTurnosInicial);

  const tomarTurno = (id: number) => {
    const turnoTomado = nuevosTurnos.find((turno) => turno.id === id);
    if (turnoTomado) {
      setMisTurnos([...misTurnos, turnoTomado]);
      setNuevosTurnos(nuevosTurnos.filter((turno) => turno.id !== id));
    }

    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del medico
    //y la nueva lista de turnos a tomar
  };

  const cancelarTurno = (id: number) => {
    const turnoCancelado = misTurnos.find((turno) => turno.id === id);
    if (turnoCancelado) {
      setNuevosTurnos([...nuevosTurnos, turnoCancelado]);
      setMisTurnos(misTurnos.filter((turno) => turno.id !== id));
    }

    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del medico
    //y la nueva lista de turnos a tomar
  };

  return (
    <div className="min-h-screen items-center justify-center font-sans text-center bg-gradient-to-r from-green-100 to-white">
      <h1 className="h1 text-4xl">Bienvenido, Medico</h1>
      <p className="p mb-4">Esta es la vista del panel médico.</p>

      <div className="container flex">
        <section
          id="misTurnos"
          className="flex-1 mx-2 flex flex-col items-center "
        >
          <h1 className="text-3xl">Tus Turnos</h1>
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
                  <div className="mb-2">
                    <div className="font-bold">Motivo:</div>
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
        <section
          id="nuevosTurnos"
          className="flex-1 mx-2 flex flex-col items-center"
        >
          <h1 className="text-3xl">Nuevos Turnos</h1>
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
                  <div className="mb-2">
                    <div className="font-bold">Motivo:</div>
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
      </div>
    </div>
  );
}
