'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  rol: 'paciente' | 'medico' | 'administrator';
}

export default function LoginPaciente() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Credenciales inválidas');
        return;
      }

      const data = await res.json();

      const userRol =
        data.user?.type?.name ||
        data.user?.role ||
        data.user?.rol ||
        "";

      if (
        userRol.toLowerCase() !== 'paciente' &&
        userRol.toLowerCase() !== 'patient'
      ) {
        setError(
          'Solo los usuarios con rol de paciente pueden ingresar aquí'
        );
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);

      router.push("/paciente");
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </button>

  {/*caja inicio de sesion*/}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md z-10">
        <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
        <p className="text-center mb-6">Accedé para gestionar tus turnos y ver tus consultas</p>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded border border-gray-300 text-base"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border border-gray-300 text-base"
          />
          <button
          onClick={() => router.push('/paciente')}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
