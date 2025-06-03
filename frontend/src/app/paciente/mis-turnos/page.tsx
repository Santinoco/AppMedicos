'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function MisTurnos() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date()); // Solo en el cliente
  }, []);

  if (!date) return null; // Evita el render hasta tener la fecha

  return (
    <div>
      <h1>Mis Turnos</h1>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Calendar
          onChange={(value: Date | Date[]) => {
            if (value instanceof Date) {
              setDate(value);
            }
          }}
          value={date}
          selectRange={false}
        />

        <p style={{ marginTop: '1rem' }}>
          Fecha seleccionada: <strong>{date.toLocaleDateString()}</strong>
        </p>

        <div style={{
          marginTop: '2rem',
          width: '100%',
          maxWidth: '500px',
          background: '#f1f8e9',
          padding: '1rem',
          borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <h3>Turnos disponibles</h3>
          <ul>
            <li>🕒 10:00 - Dr. López (Cardiología) <button>Reservar</button></li>
            <li>🕒 11:00 - Dra. Ramírez (Clínica) <button>Reservar</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
