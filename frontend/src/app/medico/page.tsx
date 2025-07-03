"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackMedico } from "../../types/backMedico";
import { BackPaciente } from "../../types/backPaciente";
import { BackTurno } from "../../types/backTurno";
import { getUserId } from "../../services/userIdService";
import { Turno } from "../../types/Turno";
import { verificarTipoUsuario } from "../../services/guardService";
import {toast} from "sonner";
interface Medico {
  nombre: string;
  especialidad: string;
  numeroMatricula: number;
  email: string;
  comienzoJornada: string;
  finJornada: string;
}

export default function MedicoDashboard() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [especialidadInput, setEspecialidadInput] = useState<string | null>(
    null
  );
  const [comienzoJornadaInput, setComienzoJornadaInput] = useState<
    string | null
  >(null);
  const [finJornadaInput, setFinJornadaInput] = useState<string | null>(null);
  const [medico, setMedico] = useState<Medico>({
    nombre: "",
    especialidad: "",
    numeroMatricula: 0,
    email: "",
    comienzoJornada: "",
    finJornada: "",
  });
  const [turno, setTurno] = useState<Turno>({
    id: 1,
    nombre: "",
    email: "",
    motivo: "",
    fechaTurno: new Date("2025-05-29T10:30:00"),
    estado: 0,
  });
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación

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
    // Obtener el ID del usuario logueado
    const userId = getUserId();
    const fetchUserById = async () => {
      if (!userId) return;

      const token = localStorage.getItem("access_token");

      try {
        // El backend retorna un objeto con los datos del médico
        getMedico(token, userId);
        try {
          // El backend retorna un objeto con los datos de los turnos del medico
          const responseTurno = await axios.get(
            `http://localhost:3000/appointments/doctor/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const turnoData: BackTurno = responseTurno.data.find(
            (turno) => turno.status.status === "pending"
          );

          try {
            // Obtener datos del paciente del primer turno
            const responsePaciente = await axios.get(
              `http://localhost:3000/patients/${turnoData.patient.user_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const pacienteData: BackPaciente = responsePaciente.data;

            // Asignar el primer turno como "próximo turno"
            setTurno({
              id: turnoData.id,
              nombre: `${pacienteData.user.nombre} ${pacienteData.user.apellido}`,
              email: pacienteData.user.email,
              motivo: turnoData.motivo,
              fechaTurno: turnoData.slot_datetime.slot_datetime,
              estado: turnoData.status.status_id,
            });
          } catch (error) {
            console.error("Error al obtener los datos del paciente:", error);
          }
        } catch (error) {
          console.error("Error al obtener los datos del turno:", error);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserById();
  }, [isVerified]);

  const getMedico = async (token, userId) => {
    const responseMedico = await axios.get(
      `http://localhost:3000/doctors/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const medicoData: BackMedico = responseMedico.data;

    setMedico({
      nombre: `${medicoData.user.nombre} ${medicoData.user.apellido}`,
      especialidad: medicoData.specialty,
      numeroMatricula: medicoData.license_number,
      email: medicoData.user.email,
      comienzoJornada: medicoData.shift_start,
      finJornada: medicoData.shift_end,
    });
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar los campos de entrada
    if (
      (comienzoJornadaInput &&
        finJornadaInput &&
        parseInt(comienzoJornadaInput) >= 1000 &&
        parseInt(finJornadaInput) <= 1900 &&
        parseInt(comienzoJornadaInput) < parseInt(finJornadaInput)) ||
      (!comienzoJornadaInput && !finJornadaInput)
    ) {
      var especialidadFormateada: string;
      var especialidadActualizada: boolean = true;
      var comienzoJornadaFormateado: string;
      var comienzoJornadaActualizado: boolean = true;
      var finJornadaFormateado: string;
      var finJornadaActualizado: boolean = true;
      // Formatear los valores de jornadas
      if (comienzoJornadaInput && finJornadaInput) {
        comienzoJornadaFormateado = `${comienzoJornadaInput.slice(
          0,
          2
        )}:${comienzoJornadaInput.slice(2, 4)}:00`;
        finJornadaFormateado = `${finJornadaInput.slice(
          0,
          2
        )}:${finJornadaInput.slice(2, 4)}:00`;
      } else {
        // Si no se ingresaron valores, mantener los valores actuales
        comienzoJornadaFormateado = medico.comienzoJornada;
        comienzoJornadaActualizado = false;
        finJornadaFormateado = medico.finJornada;
        finJornadaActualizado = false;
      }
      if (especialidadInput) {
        especialidadFormateada = especialidadInput;
      } else {
        especialidadFormateada = medico.especialidad;
        especialidadActualizada = false;
      }

      const token = localStorage.getItem("access_token");
      const userId = getUserId();

      try {
        // Actualizar la jornada del médico en el backend
        await axios.patch(
          `http://localhost:3000/doctors/${userId}`,
          {
            specialty: especialidadFormateada,
            shift_start: comienzoJornadaFormateado,
            shift_end: finJornadaFormateado,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }

      try {
        getMedico(token, userId); // Actualizar los datos del médico después de la modificación
      } catch (error) {
        console.error("Error al obtener datos actualizados del medico:", error);
      }
      // Mostrar mensaje de éxito
      if (especialidadActualizada) {
        toast.success(`Especialidad actualizada: ${especialidadFormateada}`);
      }
      if (comienzoJornadaActualizado && finJornadaActualizado) {
        toast.success(
          `Jornada actualizada: ${comienzoJornadaFormateado} - ${finJornadaFormateado}`
        );
      }
    } else {
      toast.info("Por favor, ingrese valores válidos.");
    }
  };

  return (
    <main className="flex-1 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, {medico.nombre}
      </h1>
      <p>Especialidad: {medico.especialidad}</p>
      <p>Numero de matricula: {medico.numeroMatricula}</p>
      <p>
        Jornada laboral: {medico.comienzoJornada} a {medico.finJornada}
      </p>
      <p>Email: {medico.email}</p>
      <section className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          📌 Próximo turno
        </h3>
        {turno.id === 1 &&
        turno.nombre === "" &&
        turno.email === "" &&
        turno.motivo === "" &&
        turno.fechaTurno.getTime() ===
          new Date("2025-05-29T10:30:00").getTime() &&
        turno.estado === 0 ? (
          <p className="text-gray-500">No hay turnos pendientes.</p>
        ) : (
          <div>
            <div className="mb-1">
              <span className="font-bold">{turno.nombre}</span>{" "}
              <span className="text-gray-500 font-light">- {turno.email}</span>
            </div>
            <div className="mb-1">
              <span className="font-bold mr-1">Fecha:</span>
              📅{" "}
              {new Date(turno.fechaTurno).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </div>
            <div className="mb-1">
              <div className="font-bold">Motivo de consulta:</div>
              <p>{turno.motivo}</p>
            </div>
          </div>
        )}
      </section>
      <button
        onClick={() => router.push("/medico/mis-turnos")}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mr-8"
      >
        Ver mas turnos
      </button>
      <button
        onClick={toggleFormulario}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        {mostrarFormulario ? "Ocultar formulario" : "Editar tus Datos"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="especialidad" className="block font-bold">
              Especialidad:
            </label>
            <select
              id="especialidad"
              value={especialidadInput || ""}
              onChange={(e) => setEspecialidadInput(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="" disabled>
                Seleccione una especialidad
              </option>
              <option value="Pediatría">Pediatría</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Dermatología">Dermatología</option>
              <option value="Ginecología">Ginecología</option>
              <option value="Neurología">Neurología</option>
              <option value="Traumatología">Traumatología</option>
              <option value="Oftalmología">Oftalmología</option>
              <option value="Oncología">Oncología</option>
            </select>
          </div>
          <div>
            <label htmlFor="comienzoJornada" className="block font-bold">
              Comienzo Jornada:
            </label>
            <input
              type="number"
              id="comienzoJornada"
              value={comienzoJornadaInput || ""}
              onChange={(e) => setComienzoJornadaInput(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Ingrese un número de 4 dígitos mayor o igual a 1000. Ejemplo: 1100 para las 11:00hs"
            />
          </div>
          <div>
            <label htmlFor="finJornada" className="block font-bold">
              Fin Jornada:
            </label>
            <input
              type="number"
              id="finJornada"
              value={finJornadaInput || ""}
              onChange={(e) => setFinJornadaInput(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Ingrese un número de 4 dígitos menor o igual a 1900. Ejemplo: 1900 para las 19:00hs"
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
    </main>
  );
}
