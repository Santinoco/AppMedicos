"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  tipo: number;
}

interface Turno {
  id: number;
  nombre: string;
  email: string;
  fechaTurno: Date;
  motivo: string;
  estado: number;
}

interface Medico {
  especialidad: string;
  numeroMatricula: number;
  turnos: Turno[];
}

interface Paciente {
  consultasCompletadas: number;
  seguroMedico: string;
  historialMedico: string;
  peso: number;
  altura: number;
  tipoSangre: String;
  turnos: Turno[];
}

const usuario: Usuario = {
  id: 1,
  nombre: "Juan",
  apellido: "Perez",
  email: "juan@mail.com",
  activo: true,
  tipo: 0, // 0 = medico, 1 = paciente
};

const medico: Medico = {
  especialidad: "Neurología",
  numeroMatricula: 123456,
  turnos: [],
};

const paciente: Paciente = {
  consultasCompletadas: 5,
  seguroMedico: "OSDE",
  historialMedico: "Sin antecedentes relevantes",
  peso: 70,
  altura: 175,
  tipoSangre: "O+",
  turnos: [],
};

export default function AdminUserView() {
  const router = useRouter();
  // La id del parametro se utilizara para realizar el get usuario by id
  const params = useParams();
  const idUsuario = params.id;

  const [turnos, setTurnos] = useState<Turno[]>([
    {
      id: 1,
      nombre: "Juan Perez",
      email: "juan@mail.com",
      motivo: "Fiebre",
      fechaTurno: new Date("2025-05-29T10:30:00"),
      estado: 0, // 0 = pendiente, 1 = confirmado, 2 = cancelado
    },
    {
      id: 2,
      nombre: "Maria Gomez",
      email: "maria@mail.com",
      motivo: "Control",
      fechaTurno: new Date("2025-05-29T11:00:00"),
      estado: 1, // 0 = pendiente, 1 = confirmado, 2 = cancelado
    },
  ]);

  const cancelarTurno = (id: number) => {
    const turnoCancelado = turnos.find((turno) => turno.id === id);
    //Aca deberia usar uno o 2 Post al back para actualizar la lista de turnos del usuario
    //por ahora solo actualizo el estado local
    if (turnoCancelado) {
      const nuevaLista = turnos.filter((turno) => turno.id !== id);
      setTurnos(nuevaLista);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-1 p-10 space-y-6">
        <div className="flex">
          <h1 className="text-3xl font-bold text-green-800">
            Informacion del usuario
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
          >
            Volver
          </button>
        </div>
        <div>
          <span className="text-3xl font-bold text-black">
            {usuario.nombre} {usuario.apellido}
          </span>
          <span className="text-gray-500 font-light"> - {usuario.email}</span>
        </div>
        <p>
          <span className="font-bold mr-1">Id: </span>
          {usuario.id}
        </p>
        <p>
          <span className="font-bold mr-1">Tipo de usuario:</span>
          {usuario.tipo === 0 ? <span>Medico</span> : <span>Paciente</span>}
        </p>
        <p>
          <span className="font-bold mr-1">Actividad:</span>
          {usuario.activo ? (
            <strong className="text-green-600 ml-1">Activo</strong>
          ) : (
            <strong className="text-red-700 ml-1">Inactivo</strong>
          )}
        </p>
        {usuario.tipo === 0 ? (
          <div className="space-y-6">
            <p>
              <span className="font-bold mr-1">Especialidad:</span>
              {medico.especialidad}
            </p>
            <p>
              <span className="font-bold mr-1">Matricula:</span>
              {medico.numeroMatricula}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p>
              <span className="font-bold mr-1">Consultas completadas:</span>
              {paciente.consultasCompletadas}
            </p>
            <p>
              <span className="font-bold mr-1">Seguro Medico:</span>
              {paciente.seguroMedico}
            </p>
            <p>
              <span className="font-bold mr-1">Historial Medico:</span>
              {paciente.historialMedico}
            </p>
            <p>
              <span className="font-bold mr-1">Peso:</span> {paciente.peso}
            </p>
            <p>
              <span className="font-bold mr-1">Altura:</span> {paciente.altura}
            </p>
            <p>
              <span className="font-bold mr-1">Tipo de sangre:</span>
              {paciente.tipoSangre}
            </p>
          </div>
        )}

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📅 Turnos agendados</h2>
          {turnos.length === 0 ? (
            <p className="text-gray-500">No tenés turnos agendados.</p>
          ) : (
            <ul className="space-y-4">
              {turnos.map((turno) => (
                <li
                  className="border p-4 rounded-lg flex justify-between items-start"
                  key={turno.id}
                >
                  <div>
                    <div>
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
                      {turno.estado === 0 ? (
                        <span>Pendiente</span>
                      ) : turno.estado === 1 ? (
                        <span>Confirmado</span>
                      ) : (
                        <span>Cancelado</span>
                      )}
                    </div>
                    <div className="mb-1">
                      <div className="font-bold">Motivo de consulta:</div>
                      <p>{turno.motivo}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => cancelarTurno(turno.id)}
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
      </main>
    </div>
  );
}
