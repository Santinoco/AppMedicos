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

interface Medico {
  nombre: String;
  especialidad: String;
  numeroMatricula: number;
  email: String;
  comienzoJornada: string;
  finJornada: string;
}

export default function MedicoDashboard() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
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
    estado: "",
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

        try {
          // El backend retorna un objeto con los datos de los turnos del medico
          const responseTurno = await axios.get(
            `http://localhost:3000/appointments/doctor/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const turnoData: BackTurno[] = responseTurno.data;

          try {
            // Obtener datos del paciente del primer turno
            const responsePaciente = await axios.get(
              `http://localhost:3000/patients/${turnoData[0].patient.user_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const pacienteData: BackPaciente = responsePaciente.data;

            // Asignar el primer turno como "próximo turno"
            setTurno({
              id: turnoData[0].id,
              nombre: `${pacienteData.user.nombre} ${pacienteData.user.apellido}`,
              email: pacienteData.user.email,
              motivo: turnoData[0].motivo,
              fechaTurno: turnoData[0].slot_datetime.slot_datetime,
              estado: turnoData[0].status.status,
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

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      comienzoJornadaInput &&
      finJornadaInput &&
      parseInt(comienzoJornadaInput) >= 1000 &&
      parseInt(finJornadaInput) <= 1900 &&
      parseInt(comienzoJornadaInput) < parseInt(finJornadaInput)
    ) {
      setMedico((prevMedico) => ({
        ...prevMedico,
        comienzoJornada: `${comienzoJornadaInput.slice(
          0,
          2
        )}:${comienzoJornadaInput.slice(2)}`,
        finJornada: `${finJornadaInput.slice(0, 2)}:${finJornadaInput.slice(
          2
        )}`,
      }));
      alert(
        `Jornada actualizada: ${medico.comienzoJornada} - ${medico.finJornada}`
      );
      // Agregar lógica para enviar los datos al backend con post
    } else {
      alert("Por favor, ingrese valores válidos.");
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
        </div>
        <div className="mb-1">
          <div className="font-bold">Motivo de consulta:</div>
          <p>{turno.motivo}</p>
        </div>
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
        {mostrarFormulario ? "Ocultar formulario" : "Editar jornada"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
              placeholder="Ingrese un número de 4 dígitos mayor o igual a 1000"
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
              placeholder="Ingrese un número de 4 dígitos menor o igual a 1900"
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
