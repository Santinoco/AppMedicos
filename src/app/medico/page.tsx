import styles from '../../styles/home.module.css'; 
export default function MedicoDashboard() {
  return (<div className={styles.main}>
      <h1 className={styles.h1}>Bienvenido, Medico</h1>
      <p className={styles.p}>Esta es la vista del panel médico.</p>
</div>);
}
