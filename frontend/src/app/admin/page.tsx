"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackMedico } from "../../types/backMedico";
import { BackPaciente } from "../../types/backPaciente";
import { verificarTipoUsuario } from "../../services/guardService";
import { BackUser } from "../../types/backUser";

interface Medico {
  especialidad: string;
  matricula: string;
  usuario: {
    id: 0;
    nombre: "";
    apellido: "";
    email: "";
    activo: false;
  };
}

interface Paciente {
  consultasCompletadas: number;
  seguroMedico: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
}

const pacientesInicial: Paciente[] = [
  {
    consultasCompletadas: 0,
    seguroMedico: "",
    usuario: {
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      activo: false,
    },
  },
];

const medicosInicial: Medico[] = [
  {
    especialidad: "",
    matricula: "",
    usuario: {
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      activo: false,
    },
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>(medicosInicial);
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesInicial);
  const [medicosAux, setMedicosAux] = useState<Medico[]>([]);
  const [pacientesAux, setPacientesAux] = useState<Paciente[]>([]);
  const [mostrarMedicos, setMostrarMedicos] = useState(true);
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
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const responseMedicos = await axios.get(
          `http://localhost:3000/doctors`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const medicosData: Medico[] = responseMedicos.data.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            usuario: {
              id: medico.user.id,
              nombre: medico.user.nombre,
              apellido: medico.user.apellido,
              email: medico.user.email,
              activo: medico.user.activo,
            },
          })
        );

        setMedicos(medicosData);
        setMedicosAux(medicosData);
      } catch (error) {
        console.error("Error al obtener los medicos:", error);
      }
      try {
        const responsePacientes = await axios.get(
          `http://localhost:3000/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const pacientesData: Paciente[] = responsePacientes.data.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            usuario: {
              id: paciente.user.id,
              nombre: paciente.user.nombre,
              apellido: paciente.user.apellido,
              email: paciente.user.email,
              activo: paciente.user.activo,
            },
          })
        );

        setPacientes(pacientesData);
        setPacientesAux(pacientesData);
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      }
    };
    fetchUsuarios();
  }, [isVerified]); // Solo ejecuta la lógica de usuarios si está verificado

  const eliminarUsuario = async (idUsuario: number, tipo: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const token = localStorage.getItem("access_token");
      // Realiza la solicitud DELETE al backend para eliminar el usuario
      try {
        await axios.delete(`http://localhost:3000/users/${idUsuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario. Inténtalo más tarde.");
        return;
      }
      // Modificacion visual de la lista de usuarios local
      if (tipo === "medico") {
        const nuevaListaMedicos = medicos.filter(
          (medico) => medico.usuario.id !== idUsuario
        );
        setMedicos(nuevaListaMedicos);
      } else if (tipo === "paciente") {
        const nuevaListaPacientes = pacientes.filter(
          (paciente) => paciente.usuario.id !== idUsuario
        );
        setPacientes(nuevaListaPacientes);
      }
      alert(`Usuario con ID ${idUsuario} eliminado.`);
    }
  };

  const handleLogout = () => {
    // Elimina el token de localStorage
    localStorage.removeItem("user");

    // Redirige al usuario a la página de inicio
    router.push("/");
  };

  const filtrarPorNombre = async (nombre: string) => {
    const token = localStorage.getItem("access_token");
    const rol = mostrarMedicos ? "doctors" : "patients";
    if (nombre != "") {
      try {
        const responseFiltrado = await axios.get(
          `http://localhost:3000/${rol}/by-name/${nombre}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (mostrarMedicos) {
          const medicosFiltrados: Medico[] = responseFiltrado.data.map(
            (medico: BackMedico) => ({
              especialidad: medico.specialty,
              matricula: medico.license_number,
              usuario: {
                id: medico.user.id,
                nombre: medico.user.nombre,
                apellido: medico.user.apellido,
                email: medico.user.email,
                activo: medico.user.activo,
              },
            })
          );
          setMedicos(medicosFiltrados);
        }
        if (!mostrarMedicos) {
          const pacientesFiltrados: Paciente[] = responseFiltrado.data.map(
            (paciente: BackPaciente) => ({
              consultasCompletadas: paciente.completed_consultations,
              seguroMedico: paciente.health_insurance,
              usuario: {
                id: paciente.user.id,
                nombre: paciente.user.nombre,
                apellido: paciente.user.apellido,
                email: paciente.user.email,
                activo: paciente.user.activo,
              },
            })
          );
          setPacientes(pacientesFiltrados);
        }
      } catch (error) {
        console.error("Error al filtrar por nombre:", error);
      }
    } else {
      reestablecerListas();
    }
  };

  const reestablecerListas = () => {
    if (mostrarMedicos) {
      setMedicos(medicosAux);
    } else {
      setPacientes(pacientesAux);
    }
  };

  return (
    <main className="flex-1 p-10 space-y-6">
      <div className="flex">
        <h1 className="text-3xl font-bold text-green-800">
          Bienvenido, Administrador
        </h1>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
          onClick={handleLogout}
        >
          Cerrar sesion
        </button>
      </div>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              mostrarMedicos
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={mostrarMedicos}
            onClick={() => setMostrarMedicos(true)}
          >
            Médicos
          </button>
          <button
            className={`py-2 px-4 rounded ${
              !mostrarMedicos
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={!mostrarMedicos}
            onClick={() => setMostrarMedicos(false)}
          >
            Pacientes
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4">
          {mostrarMedicos ? "Médicos registrados" : "Pacientes registrados"}
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
        {mostrarMedicos ? (
          <div>
            {medicos.length === 0 ? (
              <p className="text-gray-500">No se encuentra ningun medico.</p>
            ) : (
              <ul className="space-y-4">
                {medicos.map((medico) => (
                  <li
                    className="border p-4 rounded-lg flex justify-between items-start"
                    key={medico.usuario.id}
                  >
                    <div>
                      <div>
                        <span className="font-bold">
                          {medico.usuario.nombre} {medico.usuario.apellido}
                        </span>{" "}
                        <span className="text-gray-500 font-light">
                          - {medico.usuario.email}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="">Especialidad: </span>{" "}
                        {medico.especialidad}
                      </div>
                      <div className="mb-1">
                        <span className=" mr-1">Matricula:</span>
                        {medico.matricula}
                      </div>
                      <div className="mb-1">
                        <span>
                          {medico.usuario.activo ? (
                            <strong className="text-green-600">Activo</strong>
                          ) : (
                            <strong className="text-red-700">Inactivo</strong>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex-col flex gap-4 items-center">
                      <button
                        onClick={() =>
                          router.push("/admin/medico/" + medico.usuario.id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                      >
                        Ver usuario
                      </button>
                      <button
                        onClick={() =>
                          eliminarUsuario(medico.usuario.id, "medico")
                        }
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition w-full"
                      >
                        Eliminar Usuario
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            {pacientes.length === 0 ? (
              <p className="text-gray-500">No se encuentra ningun paciente.</p>
            ) : (
              <ul className="space-y-4">
                {pacientes.map((paciente) => (
                  <li
                    className="border p-4 rounded-lg flex justify-between items-start"
                    key={paciente.usuario.id}
                  >
                    <div>
                      <div>
                        <span className="font-bold">
                          {paciente.usuario.nombre} {paciente.usuario.apellido}
                        </span>{" "}
                        <span className="text-gray-500 font-light">
                          - {paciente.usuario.email}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span>Consultas completadas: </span>
                        {paciente.consultasCompletadas}
                      </div>
                      <div className="mb-1">
                        <span>Seguro médico: </span>
                        {paciente.seguroMedico || "No especificado"}
                      </div>
                      <div className="mb-1">
                        <span>
                          {paciente.usuario.activo ? (
                            <strong className="text-green-600">Activo</strong>
                          ) : (
                            <strong className="text-red-700">Inactivo</strong>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex-col flex gap-4 items-center">
                      <button
                        onClick={() =>
                          router.push("/admin/paciente/" + paciente.usuario.id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                      >
                        Ver usuario
                      </button>
                      <button
                        onClick={() =>
                          eliminarUsuario(paciente.usuario.id, "paciente")
                        }
                        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition w-full"
                      >
                        Eliminar Usuario
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
