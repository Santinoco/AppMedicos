import styles from '../styles/home.module.css'; // reutilizamos el CSS de home

export default function Login() {
  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>Iniciar sesión</h1>
      <p>Accedé a la plataforma para gestionar tus turnos médicos.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', marginTop: '2rem' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}
