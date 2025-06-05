'use client';

import { useEffect, useState } from 'react';

interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

export default function ListadoMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState<string>('');

  useEffect(() => {
    // Simulación de fetch desde backend
    const data: Medico[] = [
      { id: 1, nombre: 'Carlos', apellido: 'López', especialidad: 'Cardiología' },
      { id: 2, nombre: 'María', apellido: 'Gómez', especialidad: 'Dermatología' },
      { id: 3, nombre: 'Lucía', apellido: 'Pérez', especialidad: 'Pediatría' },
      { id: 4, nombre: 'José', apellido: 'Fernández', especialidad: 'Cardiología' },
    ];
    setMedicos(data);
  }, []);

  const especialidadesUnicas = Array.from(
    new Set(medicos.map((m) => m.especialidad))
  );

  const medicosFiltrados = especialidadFiltro
    ? medicos.filter((m) => m.especialidad === especialidadFiltro)
    : medicos;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Cartilla de Médicos
      </h1>

      <div className="mb-6">
        <label className="block mb-2 text-gray-700 font-medium">
          Filtrar por especialidad:
        </label>
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64"
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
        <p className="text-gray-500">No hay médicos para la especialidad seleccionada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicosFiltrados.map((medico) => (
            <div
              key={medico.id}
              className="bg-white shadow-md p-6 rounded-lg"
            >
              <h2 className="text-xl font-semibold text-green-800 mb-1">
                {medico.nombre} {medico.apellido}
              </h2>
              <p className="text-gray-600">Especialidad: {medico.especialidad}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
