"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BackUser } from "../../../../types/backUser";
import { BackMedico } from "../../../../types/backMedico";
import { BackPaciente } from "../../../../types/backPaciente";
import { BackTurno } from "../../../../types/backTurno";

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

  comienzoJornada: string;
  finJornada: string;
}

interface Paciente {
  consultasCompletadas: number;
  seguroMedico: string;
  historialMedico: string;
  peso: number;
  altura: number;
  tipoSangre: String;
}

const usuarioInicial: Usuario = {
  id: 0,
  nombre: "",
  apellido: "",
  email: "",
  activo: false,
  tipo: 0, // 1 = admin, 2 = medico, 5 = paciente
};

const medicoInicial: Medico = {
  especialidad: "",
  numeroMatricula: 0,
  comienzoJornada: "",
  finJornada: "",
};

const pacienteInicial: Paciente = {
  consultasCompletadas: 0,
  seguroMedico: "",
  historialMedico: "",
  peso: 0,
  altura: 0,
  tipoSangre: "",
};

const turnosInicial: Turno[] = [
  {
    id: 2,
    nombre: "",
    email: "",
    motivo: "",
    fechaTurno: new Date("1000-01-01T11:00:00"),
    estado: 0, // 1 Pendiente, 2 Completado, 3 Cancelado, 4 Reprogramado
  },
];

export default function AdminUserView() {
  const router = useRouter();
  // La id del parametro se utilizara para realizar el get usuario by id
  const params = useParams();
  const idUsuario = params.id;

  const [usuario, setUsuario] = useState<Usuario>(usuarioInicial);
  const [medico, setMedico] = useState<Medico>(medicoInicial);
  const [paciente, setPaciente] = useState<Paciente>(pacienteInicial);
  const [turnos, setTurnos] = useState<Turno[]>(turnosInicial);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        // Obtener los datos del usuario por id

        const usuarioResponse = await axios.get(
          `http://localhost:3001/users/${idUsuario}`
        );
        const usuarioData: BackUser = usuarioResponse.data;

        setUsuario({
          id: usuarioData.id,
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          activo: usuarioData.activo,
          tipo: usuarioData.user_type_id,
        });

        // Obtener los datos del médico o paciente según el tipo de usuario

        if (usuarioData.user_type_id == 2) {
          try {
            const medicoResponse = await axios.get(
              `http://localhost:3001/doctors/${usuarioData.id}`
            );
            const medicoData: BackMedico = medicoResponse.data;

            setMedico({
              especialidad: medicoData.specialty,
              numeroMatricula: medicoData.license_number,
              comienzoJornada: medicoData.shift_start,
              finJornada: medicoData.shift_end,
            });
          } catch (error) {
            console.error("Error al obtener los datos del médico:", error);
          }
        } else if (usuarioData.user_type_id == 5) {
          try {
            const pacienteResponse = await axios.get(
              `http://localhost:3001/patients/${usuarioData.id}`
            );
            const pacienteData: BackPaciente = pacienteResponse.data;

            setPaciente({
              consultasCompletadas: pacienteData.completed_consultations,
              seguroMedico: pacienteData.health_insurance,
              historialMedico: pacienteData.medical_history,
              peso: pacienteData.weight,
              altura: pacienteData.height,
              tipoSangre: pacienteData.blood_type,
            });
          } catch (error) {
            console.error("Error al obtener los datos del paciente:", error);
          }
        }

        // Obtener los turnos del usuario
        try {
          let rutaUsuario: string = "";
          if (usuarioData.user_type_id === 2) {
            rutaUsuario = "doctor";
          } else if (usuarioData.user_type_id === 5) {
            rutaUsuario = "patient";
          }

          const turnosResponse = await axios.get(
            `http://localhost:3001/appointments/${rutaUsuario}/${idUsuario}`
          );
          const turnosData: Turno[] = turnosResponse.data.map(
            (turno: BackTurno) => ({
              id: turno.id,
              nombre: `${turno.patient.nombre} ${turno.patient.apellido}`,
              email: turno.patient.email,
              motivo: turno.motivo,
              fechaTurno: new Date(turno.slot_datetime.slot_datetime),
              estado: turno.status.status_id,
            })
          );

          setTurnos(turnosData);
        } catch (error) {
          console.error("Error al obtener los turnos del usuario:", error);
        }
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      }
    };
    fetchTurnos();
  }, [idUsuario]);

  const cancelarTurno = async (id: number) => {
    const turnoCancelado = turnos.find((turno) => turno.id === id);
    if (turnoCancelado) {
      await axios.patch(`http://localhost:3001/appointments/${id}/status`, {
        estado: 3, // Cambiar el estado del turno a cancelado
      });

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
          {usuario.tipo === 2 ? (
            <span>Medico</span>
          ) : usuario.tipo === 5 ? (
            <span>Paciente</span>
          ) : (
            <span></span>
          )}
        </p>
        <p>
          <span className="font-bold mr-1">Actividad:</span>
          {usuario.activo ? (
            <strong className="text-green-600 ml-1">Activo</strong>
          ) : (
            <strong className="text-red-700 ml-1">Inactivo</strong>
          )}
        </p>
        {usuario.tipo === 2 ? (
          <div className="space-y-6">
            <p>
              <span className="font-bold mr-1">Especialidad:</span>
              {medico.especialidad}
            </p>
            <p>
              <span className="font-bold mr-1">Matricula:</span>
              {medico.numeroMatricula}
            </p>
            <p>
              <span className="font-bold mr-1">Jornada laboral:</span>
              {medico.comienzoJornada} a {medico.finJornada}
            </p>
          </div>
        ) : usuario.tipo === 5 ? (
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
        ) : (
          <span></span>
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
                      {turno.estado === 1 ? (
                        <span>Pendiente</span>
                      ) : turno.estado === 2 ? (
                        <span>Completado</span>
                      ) : turno.estado === 3 ? (
                        <span>Cancelado</span>
                      ) : turno.estado === 4 ? (
                        <span>Reprogramado</span>
                      ) : (
                        <span></span>
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
