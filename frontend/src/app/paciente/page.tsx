'use client';

import { useEffect, useState } from 'react';

interface Turno {
  id: number;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'Confirmado' | 'Pendiente';
}

export default function PacienteInicio() {
  const [user, setUser] = useState({ nombre: 'Paciente', dni: '12345678', localidad: 'Buenos Aires' });
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    // Simular fetch de datos
    setTurnos([
      {
        id: 1,
        medico: 'Dr. López',
        especialidad: 'Cardiología',
        fecha: '10/06/2025',
        hora: '10:00 AM',
        estado: 'Confirmado',
      },
      {
        id: 2,
        medico: 'Dra. Gómez',
        especialidad: 'Dermatología',
        fecha: '15/06/2025',
        hora: '14:30 PM',
        estado: 'Pendiente',
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Panel principal */}
      <main className="flex-1 p-10 space-y-6">
        <h1 className="text-3xl font-bold text-green-800">Bienvenido, {user.nombre}</h1>
        <p>📌 DNI: {user.dni}</p>
        <p>📍 Localidad: {user.localidad}</p>

        {/* Próximo turno */}
        {turnos.length > 0 && (
          <section className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-800 mb-2">📌 Próximo turno</h3>
            <p>
              <strong>{turnos[0].medico}</strong> ({turnos[0].especialidad})<br />
              📅 {turnos[0].fecha}, 🕒 {turnos[0].hora}
            </p>
          </section>
        )}

        {/* Botón sacar turno */}
        <button
          onClick={() => window.location.href = '/paciente/nuevo-turno'}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          + Sacar nuevo turno
        </button>

        {/* Turnos agendados */}
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
                  <div className="flex gap-4 items-center">
                    <span className={`text-sm px-2 py-1 rounded ${
                      turno.estado === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {turno.estado}
                    </span>
                    <button className="text-red-600 hover:underline">Cancelar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
