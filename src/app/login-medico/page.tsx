'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  rol: 'paciente' | 'medico' | 'admin';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user: User = {
      id: 1,
      email,
      rol: 'medico', // Cambiar para probar otros roles
    };

    localStorage.setItem('user', JSON.stringify(user));

    switch (user.rol) {
      case 'paciente':
        router.push('/paciente');
        break;
      case 'medico':
        router.push('/medico');
        break;
      case 'admin':
        router.push('/admin');
        break;
      default:
        router.push('/');
        break;
    }
  };

  return (
  <div className="flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
      <p className="text-center mb-6">Ingresá para administrar tu agenda y pacientes</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
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
