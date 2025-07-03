'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
interface Doctor {
  id: number;
  user: {
    nombre: string;
    apellido: string;
  };
  specialty?: string;
}

export default function ListaMedicosConFiltro() {
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [especialidadFiltro, setEspecialidadFiltro] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No autenticado. Por favor inicia sesión.');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/doctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(errMsg || 'Error al obtener doctores');
        }
        return res.json();
      })
      .then((data) => {
        setMedicos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error inesperado');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando doctores...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">Error: {error}</p>;

  // Obtener especialidades únicas para el select
  const especialidadesUnicas = Array.from(
    new Set(medicos.map((m) => m.specialty).filter(Boolean))
  ) as string[];

  // Filtrar médicos por especialidad seleccionada
  const medicosFiltrados = especialidadFiltro
    ? medicos.filter((m) => m.specialty === especialidadFiltro)
    : medicos;

  return (
    <div className="min-h-screen bg-gray-100 p-10 max-w-5xl mx-auto">
      {/* Botón Volver */}
      <button
        onClick={() => router.push('/paciente')}
        className="absolute top-9 left-80 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
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
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Cartilla de Médicos</h1>

      <div className="mb-6 max-w-xs mx-auto sm:mx-0">
        <label className="block mb-2 text-gray-700 font-medium">Filtrar por especialidad:</label>
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full"
          value={especialidadFiltro}
          onChange={(e) => setEspecialidadFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          {especialidadesUnicas.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      {medicosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600">No hay médicos para la especialidad seleccionada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicosFiltrados.map((doc, index) => (
            <div
            key={`${doc.id ?? index}-${doc.user?.nombre}`}
              className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-green-800 mb-1">
                {doc.user?.nombre} {doc.user?.apellido}
              </h2>
              {doc.specialty && <p className="text-gray-600">Especialidad: {doc.specialty}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}