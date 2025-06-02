'use client';

import { useEffect, useState } from 'react';

interface Turno {
  id: number;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
}

export default function PacienteInicio() {
  const [user, setUser] = useState({ nombre: 'Paciente', dni: '12345678', localidad: 'Buenos Aires' });
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    // Simular fetch de datos
    setTurnos([
      { id: 1, medico: 'Dr. López', especialidad: 'Cardiología', fecha: '10/06/2025', hora: '10:00 AM' },
      { id: 2, medico: 'Dra. Gómez', especialidad: 'Dermatología', fecha: '15/06/2025', hora: '14:30 PM' },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Paciente</h2>
        <nav className="flex flex-col gap-4">
          <a href="/paciente" className="text-green-700 hover:underline">Inicio</a>
          <a href="/paciente/mis-turnos" className="text-green-700 hover:underline">Mis turnos</a>
        </nav>
      </aside>

      {/* Panel principal */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Bienvenido, {user.nombre}</h1>
        <p className="mb-2">📌 DNI: {user.dni}</p>
        <p className="mb-6">📍 Localidad: {user.localidad}</p>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">📅 Turnos agendados</h2>
          {turnos.length === 0 ? (
            <p className="text-gray-500">No tenés turnos agendados.</p>
          ) : (
            <ul className="space-y-4">
              {turnos.map((turno) => (
                <li key={turno.id} className="border p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{turno.medico} - {turno.especialidad}</p>
                    <p className="text-sm text-gray-600">📅 {turno.fecha}, 🕒 {turno.hora}</p>
                  </div>
                  <button className="text-red-600 hover:underline">Cancelar</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
