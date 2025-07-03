"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BackMedico } from "../../types/backMedico";
import { getUserId } from "../../services/userService";
import { Turno } from "../../types/Turno";
import { verificarTipoUsuario } from "../../services/guardService";
import {toast} from "sonner";import {
  getDoctorById,
  updateDoctor,
  UpdateDoctorData,
} from "../../services/doctorService";
import { getNextPendingAppointmentForDoctor } from "../../services/appointmentService";
import TimeSelect from "../../components/TimeSelect";

export default function MedicoDashboard() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [medico, setMedico] = useState<BackMedico | null>(null);
  const [turno, setTurno] = useState<Turno | null>(null);
  const [formData, setFormData] = useState<UpdateDoctorData>({});

  const [isVerified, setIsVerified] = useState(false);
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

  const fetchDashboardData = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setError("No se pudo obtener la información del usuario.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ejecutar ambas peticiones en paralelo para mayor eficiencia
      const [medicoData, proximoTurnoData] = await Promise.all([
        getDoctorById(userId),
        getNextPendingAppointmentForDoctor(userId),
      ]);
      setMedico(medicoData);
      setTurno(proximoTurnoData);
    } catch (err) {
      console.error("Error al cargar los datos del dashboard:", err);
      setError("No se pudieron cargar los datos. Intente de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVerified) {
      fetchDashboardData();
    }
  }, [isVerified]);

  const toggleFormulario = () => {
    if (!mostrarFormulario && medico) {
      // Pre-llenar el formulario con los datos actuales al abrirlo
      setFormData({
        specialty: medico.specialty,
        shift_start: medico.shift_start,
        shift_end: medico.shift_end,
      });
    }
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) {
      toast.error("No se pudo identificar al usuari. Intentalo mas tarde");
      return;
    }

    // --- Validación de la jornada laboral ---
    const { shift_start, shift_end } = formData;

    // Si se modifica una hora, la otra también debe estar presente.
    if ((shift_start && !shift_end) || (!shift_start && shift_end)) {
      toast.info(
        "Debe especificar tanto la hora de inicio como la de fin de jornada."
      );
      return;
    }
    // La hora de fin debe ser posterior a la de inicio.
    if (shift_start && shift_end && shift_start >= shift_end) {
      toast.info(
        "La hora de fin de jornada debe ser posterior a la hora de inicio."
      );
      return;
    }

    try {
      await updateDoctor(userId, formData);
      toast.success("Datos actualizados con éxito.");
      setMostrarFormulario(false);
      fetchDashboardData(); // Recargar los datos para mostrar la información actualizada
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      toast.error("No se pudieron actualizar los datos. Inténtelo más tarde.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-gray-500 text-xl">Cargando dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-10 flex justify-center items-center">
        <p className="text-red-500 text-xl">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, {medico?.user?.nombre} {medico?.user?.apellido}
      </h1>
      <p>Especialidad: {medico?.specialty}</p>
      <p>Numero de matricula: {medico?.license_number}</p>
      <p>
        Jornada laboral: {medico?.shift_start} a {medico?.shift_end}
      </p>
      <p>Email: {medico?.user?.email}</p>
      <section className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          📌 Próximo turno
        </h3>
        {turno ? (
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
        ) : (
          <p className="text-gray-500">No hay turnos pendientes.</p>
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
              value={formData.specialty || ""}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
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
            <TimeSelect
              id="comienzoJornada"
              value={formData.shift_start || ""}
              onChange={(value) =>
                setFormData({ ...formData, shift_start: value })
              }
            />
          </div>
          <div>
            <label htmlFor="finJornada" className="block font-bold">
              Fin Jornada:
            </label>
            <TimeSelect
              id="finJornada"
              value={formData.shift_end || ""}
              onChange={(value) =>
                setFormData({ ...formData, shift_end: value })
              }
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
