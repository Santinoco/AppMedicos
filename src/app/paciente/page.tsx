import styles from '../../styles/home.module.css'; 
import Sidebar from '../../components/sidebar';
import TurnosAgendados from '../../components/turnosAgendados';
import FiltrarTurnos from '../../components/filtrarTurnos';
export default function MedicoDashboard() {
  return (<div style={{ display: 'flex' }}>
      <Sidebar/>

      <div className={styles.main} style={{ marginLeft: '220px', padding: '2rem', width: '100%' }}>
        <h1 className={styles.h1}>Bienvenido, Valentina</h1>
        <p><strong>DNI:</strong> 12345678</p>
        <p><strong>Localidad:</strong> Mendoza</p>

        <div style={{ marginTop: '2rem' }}>
          <h2>Turnos agendados</h2>
          <ul>
            <li>
              🩺 <strong>Dr. López</strong> - Cardiología<br />
              📅 10/06/2025 – 🕒 10:00 AM
            </li>
            {/* otros turnos */}
          </ul>
        </div>
      </div>
    </div>
    
  );
}
