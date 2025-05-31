'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../styles/home.module.css'; // reutiliza tus estilos

export default function MisTurnos() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>Mis Turnos</h1>

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
          {/* Aquí podrías mapear resultados reales más adelante */}
          <ul>
            <li>🕒 10:00 - Dr. López (Cardiología) <button>Reservar</button></li>
            <li>🕒 11:00 - Dra. Ramírez (Clínica) <button>Reservar</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
