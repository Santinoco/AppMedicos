import React from 'react';
import styles from '../styles/home.module.css';

export default function TurnosAgendados() {
  return (
    <div className={styles.main}>
      <h2>Mis turnos</h2>
      <ul>
        <li>
          <strong>Dr. López</strong> - Cardiología  
          <br />
          📅 10/06/2025, 🕒 10:00 AM  
          <br />
          <button className={styles.button}>Cancelar</button>
        </li>
        {/* más turnos */}
      </ul>
    </div>
  );
}
