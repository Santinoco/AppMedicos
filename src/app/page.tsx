'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-white p-8 font-sans text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Bienvenido a Turnos Médicos App
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        Gestioná fácilmente la agenda de turnos y pacientes de tu consultorio médico.
      </p>

      <ul className="text-left mb-6 text-gray-600 space-y-2">
        <li>✅ Reserva de turnos online sin llamadas</li>
        <li>✅ Organización clara por médico</li>
        <li>✅ Acceso rápido para pacientes</li>
      </ul>

      <Link href="/login">
        <button className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
          Iniciar sesión
        </button>
      </Link>
    </div>
  );
}
