'use client';

import { useEffect, useState } from 'react';

interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad?: string;
}

export default function ListaDoctores() {
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No autenticado. Por favor inicia sesión.');
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(errMsg || 'Error al obtener doctores');
        }
        return res.json();
      })
      .then((data) => {
        setMedicos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error inesperado');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando doctores...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Lista de Médicos</h1>
      {medicos.length === 0 ? (
        <p className="text-center text-gray-600">No hay médicos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {medicos.map((doc) => (
            <div
              key={doc.id}
              className="border border-green-300 rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-green-700">{doc.nombre} {doc.apellido}</h2>
              {doc.especialidad && (
                <p className="text-green-600 font-medium">Especialidad: {doc.especialidad}</p>
              )}
              {/* Podés agregar más detalles acá si querés */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
