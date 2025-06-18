'use client';
import { useEffect, useState } from 'react';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  medico: string;
  especialidad: string;
}

export default function ListadoTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    // Simulación de fetch
    setTurnos([
      {
        id: 1,
        fecha: '15/06/2025',
        hora: '10:00 hs',
        medico: 'Dr. López',
        especialidad: 'Cardiología',
      },
      {
        id: 2,
        fecha: '25/07/2025',
        hora: '14:30 hs',
        medico: 'Dra. Ramírez',
        especialidad: 'Pediatría',
      },
    ]);
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6">📋 Tus turnos agendados</h2>
      {turnos.length === 0 ? (
        <p className="text-gray-500">No tenés turnos por el momento.</p>
      ) : (
        <div className="space-y-4">
          {turnos.map((turno) => (
            <div key={turno.id} className="bg-white p-4 shadow rounded border-l-4 border-green-400">
              <h3 className="text-xl font-semibold text-green-700">{turno.especialidad}</h3>
              <p className="text-gray-800">👨‍⚕️ {turno.medico}</p>
              <p className="text-gray-600">📅 {turno.fecha} - 🕒 {turno.hora}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
