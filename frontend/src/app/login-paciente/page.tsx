'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  rol: 'paciente' | 'medico' | 'admin';
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
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Credenciales inválidas');
        return;
      }

      const user: User = await res.json();

      if (user.rol !== 'paciente') {
        setError('Solo los usuarios con rol de paciente pueden ingresar aquí');
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      router.push('/paciente');

    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
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
