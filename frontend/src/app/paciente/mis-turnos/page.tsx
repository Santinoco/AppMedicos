'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  medico: string;
  especialidad: string;
}

export default function MisTurnos() {
  const [date, setDate] = useState<Date | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [nuevoTurno, setNuevoTurno] = useState({ hora: '', medico: '', especialidad: '' });
  const [modoEdicion, setModoEdicion] = useState<{ id: number | null }>({ id: null });

  useEffect(() => {
    setDate(new Date());
  }, []);

  if (!date) return null;

  const fechaSeleccionada = date.toLocaleDateString();

  const handleAgregarTurno = () => {
    if (!nuevoTurno.hora || !nuevoTurno.medico || !nuevoTurno.especialidad) return;

    const nuevo: Turno = {
      id: Date.now(),
      fecha: fechaSeleccionada,
      hora: nuevoTurno.hora,
      medico: nuevoTurno.medico,
      especialidad: nuevoTurno.especialidad,
    };

    setTurnos([...turnos, nuevo]);
    setNuevoTurno({ hora: '', medico: '', especialidad: '' });
  };

  const handleEliminarTurno = (id: number) => {
    setTurnos(turnos.filter(t => t.id !== id));
  };

  const handleEditarTurno = (id: number) => {
    const turno = turnos.find(t => t.id === id);
    if (turno) {
      setNuevoTurno({
        hora: turno.hora,
        medico: turno.medico,
        especialidad: turno.especialidad,
      });
      setModoEdicion({ id });
    }
  };

  const handleActualizarTurno = () => {
    setTurnos(turnos.map(t =>
      t.id === modoEdicion.id
        ? { ...t, ...nuevoTurno, fecha: fechaSeleccionada }
        : t
    ));
    setModoEdicion({ id: null });
    setNuevoTurno({ hora: '', medico: '', especialidad: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Mis Turnos</h1>

      <div className="flex flex-col items-center">
        <Calendar
          onChange={(value: Date | Date[]) => {
            if (value instanceof Date) setDate(value);
          }}
          value={date}
          selectRange={false}
        />

        <p className="mt-4 text-lg">
          Fecha seleccionada: <strong>{fechaSeleccionada}</strong>
        </p>

        <div className="mt-6 w-full max-w-md bg-green-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">{modoEdicion.id ? 'Editar turno' : 'Agregar turno'}</h3>
          <select
            className="w-full mb-2 p-2 border rounded"
            value={nuevoTurno.hora}
            onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: e.target.value })}
            required
          >
            <option value="">Seleccionar hora</option>
            {Array.from({ length: 12 }, (_, i) => {
              const hora = 9 + i;
              const label = `${hora.toString().padStart(2, '0')}:00 hs`;
              return (
                <option key={hora} value={label}>
                  {label}
                </option>
              );
            })}
          </select>


          <select
            className="w-full mb-2 p-2 border rounded"
            value={nuevoTurno.especialidad}
            onChange={(e) => setNuevoTurno({ ...nuevoTurno, especialidad: e.target.value })}
            required
          >
            <option value="">Seleccionar especialidad</option>
            <option value="Clínica Médica">Clínica Médica</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Dermatología">Dermatología</option>
            <option value="Ginecología">Ginecología</option>
          </select>
          <select
            className="w-full mb-2 p-2 border rounded"
            value={nuevoTurno.medico}
            onChange={(e) => setNuevoTurno({ ...nuevoTurno, medico: e.target.value })}
            required
          >
            <option value="">Seleccionar médico</option>
            <option value="Dr. López">Dr. López</option>
            <option value="Dra. Ramírez">Dra. Ramírez</option>
            <option value="Dr. Torres">Dr. Torres</option>
          </select>
          {modoEdicion.id ? (
            <button onClick={handleActualizarTurno} className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">
              Actualizar Turno
            </button>
          ) : (
            <button onClick={handleAgregarTurno} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
              Agregar Turno
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
