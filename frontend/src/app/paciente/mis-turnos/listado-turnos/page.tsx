'use client';

import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

interface TokenPayload {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

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
    nombre: string;
  };
}

export default function ListadoTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const patientId = decoded.sub;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${patientId}`, {
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
    } catch (err) {
      console.error('Token inválido:', err);
      setLoading(false);
    }
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
            <p className="text-gray-700">📅 Fecha: {new Date(turno.slot_datetime.slot_datetime).toLocaleDateString()}</p>
            <p className="text-gray-700">🕒 Hora: {new Date(turno.slot_datetime.slot_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-gray-700">📌 Motivo: {turno.motivo}</p>
            <p className="text-gray-700">📍 Estado: {turno.status.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
