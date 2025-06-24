'use client';

import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { getUserId } from '../../services/userIdService';
=======
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
>>>>>>> 2f314ce (agrego redireccion a raiz cuando no se tiene un token de paciente)

export default function PacienteInicio() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [datosPaciente, setDatosPaciente] = useState<DatosPaciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const waitForCredentials = () => {
      const accessToken = localStorage.getItem("access_token");
      const userId = getUserId();
      if (!accessToken || !userId) {
        setTimeout(waitForCredentials, 50);
        return;
      }

      fetch(`http://localhost:3000/patients/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
=======
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
>>>>>>> 2f314ce (agrego redireccion a raiz cuando no se tiene un token de paciente)
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
      </main>
    </div>
  );
}
