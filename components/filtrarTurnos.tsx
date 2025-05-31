import { useState } from 'react';
import styles from '../styles/home.module.css';

type Turno = {
  id: number;
  medico: string;
  especialidad: string;
  fecha: string; // 'YYYY-MM-DD'
  hora: string; // '10:00 AM'
};

const turnosDisponibles: Turno[] = [
  { id: 1, medico: 'Dr. López', especialidad: 'Cardiología', fecha: '2025-06-10', hora: '10:00 AM' },
  { id: 2, medico: 'Dra. Pérez', especialidad: 'Dermatología', fecha: '2025-06-10', hora: '11:00 AM' },
  { id: 3, medico: 'Dr. López', especialidad: 'Cardiología', fecha: '2025-06-11', hora: '09:00 AM' },
];

export default function TurnosDesktop() {
  const [fecha, setFecha] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [medico, setMedico] = useState('');

  const especialidades = Array.from(new Set(turnosDisponibles.map(t => t.especialidad)));
  const medicos = Array.from(new Set(turnosDisponibles.map(t => t.medico)));

  const turnosFiltrados = turnosDisponibles.filter(turno => {
    return (
      (fecha === '' || turno.fecha === fecha) &&
      (especialidad === '' || turno.especialidad === especialidad) &&
      (medico === '' || turno.medico === medico)
    );
  });

  return (
    <div className={styles.main}>
      <h1>Buscar Turnos Disponibles</h1>

      <div className={styles.desktopLayout}>
        <aside className={styles.sidebar}>
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <label>Especialidad:</label>
          <select
            value={especialidad}
            onChange={e => setEspecialidad(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <option value="">Todas</option>
            {especialidades.map(espe => (
              <option key={espe} value={espe}>{espe}</option>
            ))}
          </select>

          <label>Médico:</label>
          <select
            value={medico}
            onChange={e => setMedico(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">Todos</option>
            {medicos.map(med => (
              <option key={med} value={med}>{med}</option>
            ))}
          </select>
        </aside>

        <section className={styles.calendarContainer}>
          <h2>Turnos encontrados:</h2>
          <ul>
            {turnosFiltrados.length === 0 && <li>No hay turnos disponibles</li>}
            {turnosFiltrados.map(turno => (
              <li key={turno.id} style={{ marginBottom: '1rem' }}>
                <b>{turno.medico}</b> - {turno.especialidad}<br />
                📅 {turno.fecha}, 🕒 {turno.hora}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
