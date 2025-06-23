"use client"

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserId } from '../../services/userIdService';

export default function PacienteInicio() {
  const [user, setUser] = useState(null);
  const [datosPaciente, setDatosPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const waitForCredentials = () => {
      const accessToken = localStorage.getItem("access_token");
      const userId = getUserId();
      if (!accessToken || !userId) {
        setTimeout(waitForCredentials, 50);
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/patients/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("No autorizado o error al obtener datos");
          return response.json();
        })
        .then((data) => {
          setUser({
            nombre: data.user.nombre,
            apellido: data.user.apellido,
            email: data.user.email,
          });
          setDatosPaciente({
            health_insurance: data.health_insurance,
            medical_history: data.medical_history,
            weight: data.weight,
            height: data.height,
            blood_type: data.blood_type,
            completed_consultations: data.completed_consultations,
          });
          setLoading(false);
        })
        .catch((error) => {
          setUser({ nombre: "Paciente", apellido: "", email: "" });
          setDatosPaciente(null);
          setLoading(false);
        });
    };

    waitForCredentials();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Cargando datos del paciente...</div>;
  }

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
