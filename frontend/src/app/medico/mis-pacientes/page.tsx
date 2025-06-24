"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verificarTipoUsuario } from "../../../services/guardService";
import { getUserId } from "../../../services/userIdService";
import axios from "axios";
import { Turno } from "../../../types/Turno";
import { BackTurno } from "../../../types/backTurno";

interface Paciente {
  id: number;
  nombre: string;
  email: string;
  consultasCompletadas: number;
  seguroMedico: string;
  historialMedico: string;
  peso: number;
  altura: number;
  tipoSangre: string;
}

const listaPacientesInicial: Paciente[] = [
  {
    id: 0,
    nombre: "",
    email: "",
    consultasCompletadas: 0,
    seguroMedico: "",
    historialMedico: "",
    peso: 0,
    altura: 0,
    tipoSangre: "",
  },
];
export default function misPacientes() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(false); // Estado para controlar la verificación
  const [listaPacientes, setListaPacientes] = useState<Paciente[]>(
    listaPacientesInicial
  );
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<number | null>(
    null
  ); // Estado para controlar qué formulario mostrar
  const [seguroMedicoInput, setSeguroMedicoInput] = useState<string>(null);
  const [historialMedicoInput, setHistorialMedicoInput] =
    useState<string>(null);
  const [pesoInput, setPesoInput] = useState<number>(null);
  const [alturaInput, setAlturaInput] = useState<number>(null);
  const [tipoSangreInput, setTipoSangreInput] = useState<string>(null);

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
    fetchPacientes();
  }, [isVerified]);

  const fetchPacientes = async () => {
    const token = localStorage.getItem("access_token") || "";
    // Obtener el ID del usuario logueado
    const userId = getUserId();
    try {
      const responseTurnos = await axios.get(
        `http://localhost:3000/appointments/doctor/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Crear una lista de pacientes únicos
      const pacientesData: Paciente[] = [];
      responseTurnos.data.forEach((turno: BackTurno) => {
        const existePaciente = pacientesData.some(
          (paciente) => paciente.id === turno.patient.user_id
        );
        if (!existePaciente) {
          pacientesData.push({
            id: turno.patient.user_id,
            nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
            email: turno.patient.user.email,
            consultasCompletadas: turno.patient.completed_consultations,
            seguroMedico: turno.patient.health_insurance,
            historialMedico: turno.patient.medical_history,
            peso: turno.patient.weight,
            altura: turno.patient.height,
            tipoSangre: turno.patient.blood_type,
          });
        }
      });
      setListaPacientes(pacientesData);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    }
  };

  const filtrarPorNombre = async (nombre: string) => {
    const token = localStorage.getItem("access_token");
    const userId = getUserId();
    if (nombre.trim() === "") {
      fetchPacientes(); // Si el campo está vacío, recargar todos los turnos
    } else {
      const responseFiltrado = await axios.get(
        `http://localhost:3000/appointments/appointments-by-patient-name/${nombre}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Crear una lista de pacientes únicos
      const pacientesData: Paciente[] = [];
      responseFiltrado.data.forEach((turno: BackTurno) => {
        const existePaciente = pacientesData.some(
          (paciente) => paciente.id === turno.patient.user_id
        );
        if (!existePaciente) {
          pacientesData.push({
            id: turno.patient.user_id,
            nombre: `${turno.patient.user.nombre} ${turno.patient.user.apellido}`,
            email: turno.patient.user.email,
            consultasCompletadas: turno.patient.completed_consultations,
            seguroMedico: turno.patient.health_insurance,
            historialMedico: turno.patient.medical_history,
            peso: turno.patient.weight,
            altura: turno.patient.height,
            tipoSangre: turno.patient.blood_type,
          });
        }
      });
      setListaPacientes(pacientesData);
    }
  };

  const handleSubmit = async (e: React.FormEvent, paciente: Paciente) => {
    e.preventDefault();
    var seguroMedico: string;
    var seguroMedicoActualizado: boolean = false;
    var peso: number;
    var pesoActualizado: boolean = false;
    var altura: number;
    var alturaActualizada: boolean = false;
    var tipoSangre: string;
    var tipoSangreActualizada: boolean = false;
    var historialMedico: string;
    var historialMedicoActualizado: boolean = false;

    if (seguroMedicoInput) {
      seguroMedico = seguroMedicoInput;
      seguroMedicoActualizado = true;
    } else {
      seguroMedico = paciente.seguroMedico;
    }
    if (pesoInput) {
      peso = pesoInput;
      pesoActualizado = true;
    } else {
      peso = paciente.peso;
    }
    if (alturaInput) {
      altura = alturaInput;
      alturaActualizada = true;
    } else {
      altura = paciente.altura;
    }
    if (tipoSangreInput) {
      tipoSangre = tipoSangreInput;
      tipoSangreActualizada = true;
    } else {
      tipoSangre = paciente.tipoSangre;
    }
    if (historialMedicoInput) {
      historialMedico = historialMedicoInput;
      historialMedicoActualizado = true;
    } else {
      historialMedico = paciente.historialMedico;
    }

    const token = localStorage.getItem("access_token");
    try {
      await axios.patch(
        `http://localhost:3000/patients/${paciente.id}`,
        {
          health_insurance: seguroMedico,
          weight: peso,
          height: altura,
          blood_type: tipoSangre,
          medical_history: historialMedico,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error al actualizar los datos del paciente:", error);
    }
    try {
      fetchPacientes();
    } catch (error) {
      console.error("Error al obtener los pacientes actualizados:", error);
    }
    alert(`Paciente ${paciente.nombre} actualizado`);
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

        {listaPacientes.length === 0 ? (
          <p className="text-gray-500">No tenés pacientes asignados.</p>
        ) : (
          <ul className="space-y-4">
            {listaPacientes.map((paciente) => (
              <li
                className="border p-4 rounded-lg flex justify-between items-start"
                key={paciente.id}
              >
                <div>
                  <div className="mb-1">
                    <span className="font-bold">{paciente.nombre}</span>{" "}
                    <span className="text-gray-500 font-light">
                      - {paciente.email}
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
                    onClick={() =>
                      setPacienteEnEdicion(
                        pacienteEnEdicion === paciente.id ? null : paciente.id
                      )
                    } // Alternar el formulario del paciente actual
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
                  >
                    {pacienteEnEdicion === paciente.id
                      ? "Ocultar formulario"
                      : "Editar Datos"}
                  </button>
                  {pacienteEnEdicion === paciente.id && ( // Mostrar el formulario solo si este paciente está en edición
                    <form
                      onSubmit={(e) => handleSubmit(e, paciente)}
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
                          value={seguroMedicoInput || ""}
                          onChange={(e) => setSeguroMedicoInput(e.target.value)}
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
                          value={pesoInput || ""}
                          onChange={(e) => setPesoInput(Number(e.target.value))}
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
                          value={alturaInput || ""}
                          onChange={(e) =>
                            setAlturaInput(Number(e.target.value))
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
                          value={tipoSangreInput || ""}
                          onChange={(e) => setTipoSangreInput(e.target.value)}
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
                          value={historialMedicoInput || ""}
                          onChange={(e) =>
                            setHistorialMedicoInput(e.target.value)
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
