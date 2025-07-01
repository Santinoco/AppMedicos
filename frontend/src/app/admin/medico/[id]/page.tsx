"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BackMedico } from "../../../../types/backMedico";
import { BackTurno } from "../../../../types/backTurno";
import { verificarTipoUsuario } from "../../../../services/guardService";
import {toast} from "sonner";
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
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
}

const medicoInicial: Medico = {
  especialidad: "",
  numeroMatricula: 0,
  comienzoJornada: "",
  finJornada: "",
  usuario: {
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    activo: false,
  },
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

  const [medico, setMedico] = useState<Medico>(medicoInicial);
  const [turnos, setTurnos] = useState<Turno[]>(turnosInicial);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación

  useEffect(() => {
    const verificarAcceso = async () => {
      const esAdmin = verificarTipoUsuario("administrator");
      if (!esAdmin) {
        // Redirige al usuario si no es administrador
        router.push("/");
      } else {
        setIsVerified(true); // Marca como verificado si es administrador
      }
    };

    verificarAcceso();
  }, [router]);

  useEffect(() => {
    const fetchTurnos = async () => {
      const token = localStorage.getItem("access_token");

      // Obtener los datos del médico por ID
      try {
        const medicoResponse = await axios.get(
          `http://localhost:3000/doctors/${idUsuario}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const medicoData: BackMedico = medicoResponse.data;

        setMedico({
          especialidad: medicoData.specialty,
          numeroMatricula: medicoData.license_number,
          comienzoJornada: medicoData.shift_start,
          finJornada: medicoData.shift_end,
          usuario: {
            id: medicoData.user.id,
            nombre: medicoData.user.nombre,
            apellido: medicoData.user.apellido,
            email: medicoData.user.email,
            activo: medicoData.user.activo,
          },
        });
      } catch (error) {
        console.error("Error al obtener los datos del médico:", error);
      }

      // Obtener los turnos del medico
      try {
        obtenerTurnosMedico(token);
      } catch (error) {
        console.error("Error al obtener los turnos del usuario:", error);
      }
    };
    fetchTurnos();
  }, [isVerified]);

  const obtenerTurnosMedico = async (token) => {
    const turnosResponse = await axios.get(
      `http://localhost:3000/appointments/doctor/${idUsuario}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const turnosData: Turno[] = turnosResponse.data.map((turno: BackTurno) => ({
      id: turno.id,
      nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
      email: turno.patient.user.email,
      motivo: turno.motivo,
      fechaTurno: new Date(turno.slot_datetime.slot_datetime),
      estado: turno.status.status_id,
    }));

    setTurnos(turnosData);
  };

  const cancelarTurno = async (id: number) => {
    const turnoCancelado = turnos.find((turno) => turno.id === id);
    if (confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      if (turnoCancelado) {
        const token = localStorage.getItem("access_token");
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

          const nuevaLista = turnos.filter((turno) => turno.id !== id);
          setTurnos(nuevaLista);
          toast.success(`Turno con ID ${id} cancelado exitosamente`);
        } catch (error) {
          console.error("Error al cancelar el turno:", error);
          toast.error("No se pudo cancelar el turno. Intentalo más tarde");
        }
      }
    }
  };

  const filtrarPorNombre = async (nombre: string) => {
    const token = localStorage.getItem("access_token");
    const userId = medico.usuario.id;
    if (nombre.trim() === "") {
      obtenerTurnosMedico(token); // Si el campo está vacío, obtener todos los turnos
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

      setTurnos(turnosFiltrados);
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
            {medico.usuario.nombre} {medico.usuario.apellido}
          </span>
          <span className="text-gray-500 font-light">
            {" "}
            - {medico.usuario.email}
          </span>
        </div>
        <p>
          <span className="font-bold mr-1">Id: </span>
          {medico.usuario.id}
        </p>
        <p>
          <span className="font-bold mr-1">Tipo de usuario:</span>

          <span>Medico</span>
        </p>
        <p>
          <span className="font-bold mr-1">Actividad:</span>
          {medico.usuario.activo ? (
            <strong className="text-green-600 ml-1">Activo</strong>
          ) : (
            <strong className="text-red-700 ml-1">Inactivo</strong>
          )}
        </p>

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

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📅 Turnos agendados</h2>
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
                      <span className="font-bold mr-2">Paciente:</span>
                      <span>{turno.nombre}</span>{" "}
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
                    {turno.estado !== 2 && turno.estado !== 3 && (
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
      </main>
    </div>
  );
}
