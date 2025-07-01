"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../services/guardService";
import { Paciente } from "../../types/Paciente";
import { Medico } from "../../types/Medico";
import { getAllDoctors, getDoctorsByName } from "../../services/doctorService";
import {
  getAllPatients,
  getPatientsByName,
} from "../../services/patientService";
import { BackPaciente } from "../../types/backPaciente";
import { deleteUser } from "../../services/userService";
import { BackMedico } from "../../types/backMedico";

export default function AdminDashboard() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicosAux, setMedicosAux] = useState<Medico[]>([]);
  const [pacientesAux, setPacientesAux] = useState<Paciente[]>([]);
  const [mostrarMedicos, setMostrarMedicos] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar el fin de la carga de datos
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  const [filtroNombre, setFiltroNombre] = useState("");

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
      if (!isVerified) return; // No hacer nada si el usuario no está verificado

      const token = localStorage.getItem("access_token");
      setIsLoading(true);
      setError(null);

      try {
        // Usamos Promise.all para realizar las peticiones en paralelo
        const [responseMedicos, responsePacientes] = await Promise.all([
          getAllDoctors(), // Llamada al servicio para obtener médicos
          getAllPatients(), // Llamada al servicio para obtener pacientes
        ]);

        const medicosData: Medico[] = responseMedicos.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            comienzoJornada: medico.shift_start,
            finJornada: medico.shift_end,
            usuario: medico.user,
          })
        );

        setMedicos(medicosData);
        setMedicosAux(medicosData);

        const pacientesData: Paciente[] = responsePacientes.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            historialMedico: paciente.medical_history,
            peso: paciente.weight,
            altura: paciente.height,
            tipoSangre: paciente.blood_type,
            usuario: paciente.user,
          })
        );

        setPacientes(pacientesData);
        setPacientesAux(pacientesData);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        setError(
          "No se pudieron cargar los datos. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, [isVerified]);

  const eliminarUsuario = async (idUsuario: number, tipo: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUser(idUsuario);
        alert(`Usuario con ID ${idUsuario} eliminado.`);

        // Modificacion visual de la lista de usuarios local
        if (tipo === "medico") {
          const nuevaListaMedicos = medicos.filter(
            (medico) => medico.usuario.id !== idUsuario
          );
          setMedicos(nuevaListaMedicos);
          setMedicosAux(nuevaListaMedicos);
        } else if (tipo === "paciente") {
          const nuevaListaPacientes = pacientes.filter(
            (paciente) => paciente.usuario.id !== idUsuario
          );
          setPacientes(nuevaListaPacientes);
          setPacientesAux(nuevaListaPacientes);
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario. Inténtalo más tarde.");
      }
    }
  };

  const handleLogout = () => {
    // Elimina el token de localStorage
    localStorage.removeItem("user");

    // Redirige al usuario a la página de inicio
    router.push("/");
  };

  const filtrarPorNombre = async (nombre: string) => {
    if (nombre === "") {
      reestablecerListas();
      return;
    }

    try {
      if (mostrarMedicos) {
        const medicosData = await getDoctorsByName(nombre);
        const medicosFiltrados: Medico[] = medicosData.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            comienzoJornada: medico.shift_start,
            finJornada: medico.shift_end,
            usuario: medico.user,
          })
        );
        setMedicos(medicosFiltrados);
      } else {
        const pacientesData = await getPatientsByName(nombre);
        const pacientesFiltrados: Paciente[] = pacientesData.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            historialMedico: paciente.medical_history,
            peso: paciente.weight,
            altura: paciente.height,
            tipoSangre: paciente.blood_type,
            usuario: paciente.user,
          })
        );
        setPacientes(pacientesFiltrados);
      }
    } catch (err) {
      console.error("Error al filtrar por nombre:", err);
      setError("Error al realizar la búsqueda. Intente de nuevo.");
    }
  };

  const reestablecerListas = () => {
    if (mostrarMedicos) {
      setMedicos(medicosAux);
    } else {
      setPacientes(pacientesAux);
    }
  };

  useEffect(() => {
    // Cada vez que se cambia de pestaña, se resetea el filtro y la lista.
    setFiltroNombre("");
    reestablecerListas();
  }, [mostrarMedicos]);

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
            value={filtroNombre}
            onChange={(e) => {
              setFiltroNombre(e.target.value);
              filtrarPorNombre(e.target.value);
            }}
            className="border border-gray-300 rounded p-2"
          />
        </div>
        {isLoading ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : mostrarMedicos ? (
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
