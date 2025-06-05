'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos por defecto
import styles from '../styles/home.module.css'; // tu CSS verde

export default function CalendarioTurnos() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  const handleChange = (date: Date) => {
    setFechaSeleccionada(date);
    console.log('Fecha seleccionada:', date);
    // Podés acá hacer fetch a los turnos disponibles en esa fecha
  };

  return (
    <div className={styles.main}>
      <h2>Seleccioná una fecha</h2>
      <Calendar
        onChange={handleChange}
        value={fechaSeleccionada}
        minDate={new Date()} // No permite fechas pasadas
      />
      {fechaSeleccionada && (
        <p>
          Turnos disponibles para: <strong>{fechaSeleccionada.toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
}
