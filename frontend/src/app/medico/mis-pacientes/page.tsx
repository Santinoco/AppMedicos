"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verificarTipoUsuario } from "../../../services/guardService";
import { getUserId } from "../../../services/userService";
import { Paciente } from "../../../types/Paciente";
import {
  getPatientsByDoctor,
  findPatientsByName,
} from "../../../services/doctorService";
import {
  updatePatient,
  UpdatePatientData,
} from "../../../services/patientService";
import { toast } from "sonner";

export default function misPacientes() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [listaPacientes, setListaPacientes] = useState<Paciente[]>([]);
  const [pacientesBase, setPacientesBase] = useState<Paciente[]>([]);
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<UpdatePatientData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* estado del filtro y del input */
  const [nombreBusqueda, setNombreBusqueda] = useState<string>("");

  useEffect(() => {
    const verificarAcceso = () => {
      const esMedico = verificarTipoUsuario("doctor");
      if (!esMedico) router.push("/");
      else setIsVerified(true);
    };
    verificarAcceso();
  }, [router]);

  useEffect(() => {
    if (isVerified) {
      fetchPacientes();
    }
  }, [isVerified]);

  const fetchPacientes = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const pacientesData = await getPatientsByDoctor(userId);
      setListaPacientes(pacientesData);
      setPacientesBase(pacientesData);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
      setError("No se pudieron cargar los pacientes. Intente más tarde.");
      toast.error("No se pudo obtener los pacientes. Intentalo más tarde");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVerified) fetchPacientes();
  }, [isVerified]);

  const filtrarPorNombre = async (nombre: string) => {
    const userId = getUserId();
    if (!userId) return;

    if (nombre.trim() === "") {
      setListaPacientes(pacientesBase);
    } else {
      const pacientesFiltrados = await findPatientsByName(nombre, userId);
      setListaPacientes(pacientesFiltrados);
    }
  };

  const handleEditClick = (paciente: Paciente) => {
    if (pacienteEnEdicion === paciente.usuario.id) {
      setPacienteEnEdicion(null);
      setFormData({});
    } else {
      setPacienteEnEdicion(paciente.usuario.id);
      setFormData({
        health_insurance: paciente.seguroMedico,
        medical_history: paciente.historialMedico,
        weight: paciente.peso,
        height: paciente.altura,
        blood_type: paciente.tipoSangre,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, pacienteId: number) => {
    e.preventDefault();
    try {
      await updatePatient(pacienteId, formData);
      toast.success(`Datos del paciente actualizados`);
      setPacienteEnEdicion(null);
      fetchPacientes(); // Recargar la lista para mostrar los datos actualizados
    } catch (error) {
      console.error("Error al actualizar los datos del paciente:", error);
      toast.error("No se pudo actualizar el paciente. Intentalo más tarde");
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6 relative">
      {/*  Botón Volver */}
      <button
        onClick={() => router.push("/medico")}
        className="absolute top-9 left-10 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a inicio
      </button>

      <section className="mx-2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Mis Pacientes
        </h1>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">👥 Pacientes asignados</h2>
        <div className="my-4 flex items-center gap-4">
          <label htmlFor="nombre" className="mr-2">
            Filtrar:
          </label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese un nombre"
            value={nombreBusqueda}
            onChange={(e) => {
              const valor = e.target.value;
              setNombreBusqueda(valor);
              filtrarPorNombre(valor);
            }}
            className="border border-gray-300 rounded p-2"
          />
          {/*Boton limpiar */}
          <button
            onClick={() => {
              setNombreBusqueda("");
              fetchPacientes();
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
          >
            Limpiar
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Cargando pacientes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : listaPacientes.length === 0 ? (
          <p className="text-gray-500">No tienes pacientes asignados.</p>
        ) : (
          <ul className="space-y-4">
            {listaPacientes.map((paciente) => (
              <li
                className="border p-4 rounded-lg flex justify-between items-start"
                key={paciente.usuario.id}
              >
                <div>
                  <div className="mb-1">
                    <span className="font-bold">{paciente.usuario.nombre}</span>{" "}
                    <span className="text-gray-500 font-light">
                      - {paciente.usuario.email}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">
                      Consultas completadas:
                    </span>
                    <span>{paciente.consultasCompletadas}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Seguro Medico:</span>
                    <span>{paciente.seguroMedico}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Peso:</span>
                    <span>{paciente.peso}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Altura:</span>
                    <span>{paciente.altura}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Tipo de sangre:</span>
                    <span>{paciente.tipoSangre}</span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-1">Historial Medico:</span>
                    <p>{paciente.historialMedico}</p>
                  </div>
                </div>

                {/*formulario actualizar información paciente */}
                <div className="flex flex-col gap-4 items-center">
                  <button
                    onClick={() => handleEditClick(paciente)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
                  >
                    {pacienteEnEdicion === paciente.usuario.id
                      ? "Ocultar formulario"
                      : "Editar Datos"}
                  </button>
                  {pacienteEnEdicion === paciente.usuario.id && ( // Mostrar el formulario solo si este paciente está en edición
                    <form
                      onSubmit={(e) => handleSubmit(e, paciente.usuario.id)}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="block font-bold" htmlFor="seguro">
                          Seguro Médico
                        </label>
                        <input
                          type="text"
                          id="seguroMedico"
                          value={formData.health_insurance || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              health_insurance: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>

                      <div>
                        <label className="block font-bold" htmlFor="peso">
                          Peso (kg)
                        </label>
                        <input
                          id="peso"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              weight: Number(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>

                      <div>
                        <label className="block font-bold" htmlFor="altura">
                          Altura (cm)
                        </label>
                        <input
                          id="altura"
                          value={formData.height || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              height: Number(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-bold" htmlFor="sangre">
                          Tipo de Sangre
                        </label>
                        <input
                          type="text"
                          id="tipoSangre"
                          value={formData.blood_type || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              blood_type: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-bold" htmlFor="historial">
                          Historial Médico
                        </label>
                        <textarea
                          id="historialMedico"
                          value={formData.medical_history || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              medical_history: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                      >
                        Guardar
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
