"use client";
import axios from "axios";
import { useEffect, useState } from "react";

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
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos@mail.com",
    motivo: "Dolor de cabeza",
    fechaTurno: new Date("2025-05-28T09:00:00"),
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    email: "lucia@mail.com",
    motivo: "Chequeo general",
    fechaTurno: new Date("2025-05-30T14:00:00"),
  },
  {
    id: 5,
    nombre: "Diego López",
    email: "diego@mail.com",
    motivo: "Vacunación",
    fechaTurno: new Date("2025-05-27T08:30:00"),
  },
  {
    id: 6,
    nombre: "Ana Torres",
    email: "ana@mail.com",
    motivo: "Consulta",
    fechaTurno: new Date("2025-05-29T12:00:00"),
  },
];

export default function misTurnos() {
  const [misTurnos, setMisTurnos] = useState<Turno[]>(misTurnosInicial);
  const [turnosBase, setTurnosBase] = useState<Turno[]>(misTurnosInicial);
  const userId = 1; // Reemplazar con la lógica para obtener la ID del usuario logueado

  //Funcion GET, MODIFICAR SI EL JSON NO ES EL MISMO QUE EL DE EJEMPLO
  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await axios.get(`/id/${userId}`); // Modificar a ruta real
        const turnos: Turno[] = response.data.map((turno: any) => ({
          ...turno,
          fechaTurno: new Date(turno.fechaTurno), // Convertir fecha a objeto Date
        }));
        setTurnosBase(turnos);
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      }
    };
    fetchTurnos();
  }, [userId]);

  const cancelarTurno = (id: number) => {
    const turnoCancelado = misTurnos.find((turno) => turno.id === id);
    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del medico
    //y la nueva lista de turnos a tomar
    //por ahora solo actualizo el estado local
    if (turnoCancelado) {
      const nuevaLista = misTurnos.filter((turno) => turno.id !== id);
      setMisTurnos(nuevaLista);

      const nuevaBase = turnosBase.filter((turno) => turno.id !== id);
      setTurnosBase(nuevaBase);
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
