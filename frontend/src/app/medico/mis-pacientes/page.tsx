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

  useEffect(() => {
    const verificarAcceso = async () => {
      const esMedico = verificarTipoUsuario("doctor");
      if (!esMedico) {
        // Redirige al usuario si no es medico
        router.push("/");
      } else {
        setIsVerified(true); // Marca como verificado si es medico
      }
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
    } finally {
      setIsLoading(false);
    }
  };

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
      alert(`Paciente actualizado con éxito.`);
      setPacienteEnEdicion(null);
      fetchPacientes(); // Recargar la lista para mostrar los datos actualizados
    } catch (error) {
      console.error("Error al actualizar los datos del paciente:", error);
      alert("No se pudo actualizar el paciente. Inténtelo más tarde.");
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6">
      <section id="misTurnos" className=" mx-2 flex flex-col items-center ">
        <h1 className="text-3xl">Mis Pacientes</h1>
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pacientes asignados</h2>
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
                        <label
                          htmlFor="seguroMedico"
                          className="block font-bold"
                        >
                          Seguro Médico:
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
                          placeholder="Ingrese el seguro médico"
                        />
                      </div>
                      <div>
                        <label htmlFor="peso" className="block font-bold">
                          Peso (kg):
                        </label>
                        <input
                          type="number"
                          id="peso"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              weight: Number(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                          placeholder="Ingrese el peso"
                        />
                      </div>
                      <div>
                        <label htmlFor="altura" className="block font-bold">
                          Altura (cm):
                        </label>
                        <input
                          type="number"
                          id="altura"
                          value={formData.height || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              height: Number(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                          placeholder="Ingrese la altura"
                        />
                      </div>
                      <div>
                        <label htmlFor="tipoSangre" className="block font-bold">
                          Tipo de Sangre:
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
                          placeholder="Ingrese el tipo de sangre"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="historialMedico"
                          className="block font-bold"
                        >
                          Historial Médico:
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
                          placeholder="Ingrese el historial médico"
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
