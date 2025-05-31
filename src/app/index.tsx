import Link from 'next/link';
import styles from '../styles/home.module.css';
import { JSX } from 'react';

export default function Home(): JSX.Element {
  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>
        Bienvenido a Turnos Médicos App
      </h1>
      <p>
        Gestioná fácilmente la agenda de turnos y pacientes de tu consultorio médico.
      </p>

      <ul>
        <li>✅ Reserva de turnos online sin llamadas</li>
        <li>✅ Organización clara por médico</li>
        <li>✅ Acceso rápido para pacientes</li>
      </ul>

      <Link href="/login">
        <button className={styles.button}>
          Iniciar sesión
        </button>
      </Link>
    </div>
  );
}
