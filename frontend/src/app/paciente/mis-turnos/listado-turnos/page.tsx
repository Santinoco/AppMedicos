'use client';

import { useEffect, useState } from 'react';
import { getUserId } from '../../../../services/userIdService';


interface Turno {
  id: number;
  motivo: string;
  slot_datetime: {
    slot_datetime: string;
  };
  doctor: {
    user: {
      nombre: string;
      apellido: string;
    };
  };
  status: {
    status: string;
  };
}

export default function ListadoTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const patientId = getUserId();

    if (!token || !patientId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTurnos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al traer los turnos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando turnos...</p>;

  if (turnos.length === 0) return <p className="text-center mt-10">No hay turnos agendados.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Mis turnos</h2>
      <div className="grid gap-6">
        {turnos.map((turno) => (
          <div key={turno.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <p className="text-lg font-semibold text-gray-800">🩺 Doctor: {turno.doctor.user.nombre} {turno.doctor.user.apellido}</p>
            <p className="text-gray-700">
              📅 Fecha: {(() => {
                const fecha = new Date(turno.slot_datetime.slot_datetime);
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = fecha.toLocaleString('es-AR', { month: 'short' }).toLowerCase();
                const anio = fecha.getFullYear();
                return `${dia} ${mes} ${anio}`;
              })()}
            </p>


            <p className="text-gray-700">🕒 Hora: {new Date(turno.slot_datetime.slot_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}hs</p>
            <p className="text-gray-700">📌 Motivo: {turno.motivo}</p>
            <p className="text-gray-700">📍 Estado: {turno.status.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}