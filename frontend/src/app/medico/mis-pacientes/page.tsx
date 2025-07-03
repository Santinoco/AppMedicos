'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { verificarTipoUsuario } from '../../../services/guardService';
import { getUserId } from '../../../services/userIdService';

import { BackTurno } from '../../../types/backTurno';
import { Turno } from '../../../types/Turno';

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

export default function MisPacientes() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [listaPacientes, setListaPacientes] = useState<Paciente[]>([]);
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<number | null>(null);
  const [seguroMedicoInput, setSeguroMedicoInput] = useState<string>('');
  const [historialMedicoInput, setHistorialMedicoInput] = useState<string>('');
  const [pesoInput, setPesoInput] = useState<number | null>(null);
  const [alturaInput, setAlturaInput] = useState<number | null>(null);
  const [tipoSangreInput, setTipoSangreInput] = useState<string>('');

  /* estado del filtro y del input */
  const [nombreBusqueda, setNombreBusqueda] = useState<string>('');

  useEffect(() => {
    const verificarAcceso = () => {
      const esMedico = verificarTipoUsuario('doctor');
      if (!esMedico) router.push('/');
      else setIsVerified(true);
    };
    verificarAcceso();
  }, [router]);

  /* Obtener pacientes*/
  const fetchPacientes = async () => {
    const token = localStorage.getItem('access_token') || '';
    const userId = getUserId();
    try {
      const { data } = await axios.get<BackTurno[]>(
        `http://localhost:3000/appointments/doctor/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pacientesUnicos: Paciente[] = [];
      data.forEach((turno) => {
        if (!pacientesUnicos.some((p) => p.id === turno.patient.user_id)) {
          pacientesUnicos.push({
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

      setListaPacientes(pacientesUnicos);
    } catch (err) {
      console.error("Error al obtener los pacientes:", err);
      toast.error('No se pudo obtener los pacientes. Intentalo más tarde');
    }
  };

  useEffect(() => {
    if (isVerified) fetchPacientes();
  }, [isVerified]);

  const filtrarPorNombre = async (nombre: string) => {
    if (nombre.trim() === '') {
      fetchPacientes();
      return;
    }

    const token = localStorage.getItem('access_token') || '';
    try {
      const { data } = await axios.get<BackTurno[]>(
        `http://localhost:3000/appointments/appointments-by-patient-name/${nombre}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pacientesFiltrados: Paciente[] = [];
      data.forEach((turno) => {
        if (!pacientesFiltrados.some((p) => p.id === turno.patient.user_id)) {
          pacientesFiltrados.push({
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

      setListaPacientes(pacientesFiltrados);
    } catch (err) {
      console.error('Error al filtrar los pacientes:', err);
      toast.error('No se pudo filtrar los pacientes. Intentalo más tarde');
    }
  };

  const handleSubmit = async (e: React.FormEvent, paciente: Paciente) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || '';

    try {
      await axios.patch(
        `http://localhost:3000/patients/${paciente.id}`,
        {
          health_insurance: seguroMedicoInput || paciente.seguroMedico,
          weight: pesoInput ?? paciente.peso,
          height: alturaInput ?? paciente.altura,
          blood_type: tipoSangreInput || paciente.tipoSangre,
          medical_history: historialMedicoInput || paciente.historialMedico,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Datos del paciente ${paciente.nombre} actualizados`);
      setPacienteEnEdicion(null);
      fetchPacientes();
    } catch (err) {
      toast.error('No se pudo actualizar el paciente. Intentalo más tarde');
      console.error("Error al actualizar el paciente:", err);
    }
  };

  return (
    <div className="flex-1 p-10 space-y-6 relative">
      {/*  Botón Volver */}
      <button
        onClick={() => router.push('/medico')}
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
              setNombreBusqueda('');
              fetchPacientes();
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
          >
            Limpiar
          </button>
        </div>

        {/* listado pacientes */}
        {listaPacientes.length === 0 ? (
          <p className="text-gray-500">No tenés pacientes asignados.</p>
        ) : (
          <ul className="space-y-4">
            {listaPacientes.map((paciente) => (
              <li
                key={paciente.id}
                className="border p-4 rounded-lg flex justify-between items-start"
              >
            
                <div>
                  <p className="font-bold">
                    {paciente.nombre}{' '}
                    <span className="text-gray-500 font-light">- {paciente.email}</span>
                  </p>
                  <p>
                    <span className="font-bold">Consultas completadas:</span>{' '}
                    {paciente.consultasCompletadas}
                  </p>
                  <p>
                    <span className="font-bold">Seguro Médico:</span>{' '}
                    {paciente.seguroMedico}
                  </p>
                  <p>
                    <span className="font-bold">Peso:</span> {paciente.peso}
                  </p>
                  <p>
                    <span className="font-bold">Altura:</span> {paciente.altura}
                  </p>
                  <p>
                    <span className="font-bold">Tipo de sangre:</span>{' '}
                    {paciente.tipoSangre}
                  </p>
                  <p>
                    <span className="font-bold">Historial Médico:</span>{' '}
                    {paciente.historialMedico}
                  </p>
                </div>

                {/*formulario actualizar información paciente */}
                <div className="flex flex-col gap-4 items-center">
                  <button
                    onClick={() =>
                      setPacienteEnEdicion(
                        pacienteEnEdicion === paciente.id ? null : paciente.id
                      )
                    }
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
                  >
                    {pacienteEnEdicion === paciente.id
                      ? 'Ocultar formulario'
                      : 'Editar Datos'}
                  </button>

                  {pacienteEnEdicion === paciente.id && (
                    <form
                      onSubmit={(e) => handleSubmit(e, paciente)}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="block font-bold" htmlFor="seguro">
                          Seguro Médico
                        </label>
                        <input
                          id="seguro"
                          type="text"
                          value={seguroMedicoInput}
                          onChange={(e) => setSeguroMedicoInput(e.target.value)}
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>

                      <div>
                        <label className="block font-bold" htmlFor="peso">
                          Peso (kg)
                        </label>
                        <input
                          id="peso"
                          type="number"
                          value={pesoInput ?? ''}
                          onChange={(e) => setPesoInput(Number(e.target.value))}
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>

                      <div>
                        <label className="block font-bold" htmlFor="altura">
                          Altura (cm)
                        </label>
                        <input
                          id="altura"
                          type="number"
                          value={alturaInput ?? ''}
                          onChange={(e) =>
                            setAlturaInput(Number(e.target.value))
                          }
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-bold" htmlFor="sangre">
                          Tipo de Sangre
                        </label>
                        <input
                          id="sangre"
                          type="text"
                          value={tipoSangreInput}
                          onChange={(e) => setTipoSangreInput(e.target.value)}
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block font-bold" htmlFor="historial">
                          Historial Médico
                        </label>
                        <textarea
                          id="historial"
                          value={historialMedicoInput}
                          onChange={(e) =>
                            setHistorialMedicoInput(e.target.value)
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
