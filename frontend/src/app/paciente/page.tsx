'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  nombre: string;
  apellido: string;
  email: string;
}

interface DatosPaciente {
  health_insurance: string;
  medical_history: string;
  weight: number;
  height: number;
  blood_type: string;
  completed_consultations: number;
}

interface Turno {
  id: number;
  nombre: string;
  email: string;
  motivo: string;
  fechaTurno: Date;
  estado: number;
}

export default function PacienteInicio() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [datosPaciente, setDatosPaciente] = useState<DatosPaciente | null>(null);
  const [turno, setTurno] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!accessToken || !userData) {
      router.push('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    const userId = parsedUser.id;

    axios
      .get(`http://localhost:3000/patients/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setUser({
          nombre: res.data.user.nombre,
          apellido: res.data.user.apellido,
          email: res.data.user.email,
        });

        setDatosPaciente({
          health_insurance: res.data.health_insurance,
          medical_history: res.data.medical_history,
          weight: res.data.weight,
          height: res.data.height,
          blood_type: res.data.blood_type,
          completed_consultations: res.data.completed_consultations,
        });
      })
      .catch((err) => {
        console.error('Error al obtener datos del paciente:', err);
        router.push('/');
      });

    axios
      .get(`http://localhost:3000/appointments/patient/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const ahora = new Date();

        const turnosFuturosPendientes = res.data
          .filter((t: any) => {
            const fecha = new Date(t.slot_datetime.slot_datetime);
            return t.status.status === 'pending' && fecha > ahora;
          });

        if (turnosFuturosPendientes.length > 0) {
          const turnoMasProximo = turnosFuturosPendientes.sort(
            (a: any, b: any) =>
              new Date(a.slot_datetime.slot_datetime).getTime() -
              new Date(b.slot_datetime.slot_datetime).getTime()
          )[0];

          setTurno({
            id: turnoMasProximo.id,
            nombre: `${turnoMasProximo.doctor.user.nombre} ${turnoMasProximo.doctor.user.apellido}`,
            email: turnoMasProximo.doctor.user.email,
            motivo: turnoMasProximo.motivo,
            fechaTurno: new Date(turnoMasProximo.slot_datetime.slot_datetime),
            estado: turnoMasProximo.status.status_id,
          });
        }
      })
      .catch((err) => {
        console.error('Error al obtener el próximo turno del paciente:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="p-10 text-center">Cargando datos del paciente...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-1 p-10 space-y-6">
        <h1 className="text-3xl font-bold text-green-800">Bienvenido, {user?.nombre ?? 'Paciente'}</h1>
        <p>👤 Apellido: {user?.apellido ?? '-'}</p>
        <p>📧 Email: {user?.email ?? '-'}</p>
        <p>🏥 Obra social: {datosPaciente?.health_insurance ?? '-'}</p>
        <p>⚕️ Historia médica: {datosPaciente?.medical_history ?? '-'}</p>
        <p>⚖️ Peso: {datosPaciente?.weight ?? '-'} kg</p>
        <p>📏 Altura: {datosPaciente?.height ?? '-'} cm</p>
        <p>🩸 Grupo sanguíneo: {datosPaciente?.blood_type ?? '-'}</p>
        <p>✅ Consultas completadas: {datosPaciente?.completed_consultations ?? '-'}</p>

        <section className="bg-green-50 p-4 rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">📌 Próximo turno</h3>
          {turno ? (
            <div>
              <div className="mb-1">
                <span className="font-bold">{turno.nombre}</span>{' '}
                <span className="text-gray-500 font-light">- {turno.email}</span>
              </div>
              <div className="mb-1">
                <span className="font-bold mr-1">Fecha:</span> 📅{' '}
                {turno.fechaTurno.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                🕒{' '}
                {turno.fechaTurno.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="mb-1">
                <div className="font-bold">Motivo de consulta:</div>
                <p>{turno.motivo}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay turnos futuros pendientes.</p>
          )}
        </section>
      </main>
    </div>
  );
}

