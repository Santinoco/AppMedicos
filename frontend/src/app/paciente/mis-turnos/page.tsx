'use client';
import { useRouter } from 'next/navigation';

export default function MisTurnosInicio() {
  const router = useRouter();

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Gestión de turnos</h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push('/paciente/mis-turnos/listado-turnos')}
          className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded text-lg"
        >
          📋Ver mis turnos
        </button>
        <button
          onClick={() => router.push('/paciente/mis-turnos/nuevo-turno')}
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded text-lg"
        >
          ➕ Agendar nuevo turno
        </button>
      </div>
    </div>
  );
}
