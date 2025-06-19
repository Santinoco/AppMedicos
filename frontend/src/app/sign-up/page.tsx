'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const [role, setRole] = useState<'paciente' | 'medico'>('paciente');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [matricula, setMatricula] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación extra: si es médico, debe ingresar matrícula
    if (role === 'medico' && matricula.trim() === '') {
      setError('Ingrese una matricula valida');
      return;
    }

    const data = {
      role,
      nombre,
      apellido,
      email,
      password,
      ...(role === 'medico' && { matricula }), // solo incluir matrícula si es médico
    };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Error en el registro');
        return;
      }

      setSuccess('Registro exitoso! Redirigiendo...');
      setTimeout(() => {
        router.push(role === 'paciente' ? '/paciente' : '/medico');
      }, 1000);
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-white p-8 font-sans">
      <button
        onClick={() => router.push('/')}
        className="self-start mb-6 flex items-center gap-2 text-green-600 hover:text-green-800 transition"
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

      <h1 className="text-3xl font-bold mb-6">Crear una cuenta</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex items-center gap-4">
          <input
            type="radio"
            name="role"
            value="paciente"
            checked={role === 'paciente'}
            onChange={() => setRole('paciente')}
            className="accent-green-500"
          />
          Paciente
          <input
            type="radio"
            name="role"
            value="medico"
            checked={role === 'medico'}
            onChange={() => setRole('medico')}
            className="accent-green-500 ml-6"
          />
          Médico
        </label>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          className="p-2 rounded border border-gray-300"
        />

        {/* Mostrar solo si es médico */}
        {role === 'medico' && (
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
            className="p-2 rounded border border-gray-300"
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="p-2 rounded border border-gray-300"
        />

        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
