// components/Sidebar.tsx
import Link from 'next/link';
import styles from '../styles/sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Paciente</h2>
      <nav>
        <ul>
          <li><Link href="/paciente">Inicio</Link></li>
          <li><Link href="/paciente/mis-turnos">Mis turnos</Link></li>
        </ul>
      </nav>
    </div>
  );
}
