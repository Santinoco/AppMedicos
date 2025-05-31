import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/home.module.css';

interface User {
  id: number;
  email: string;
  rol: 'paciente' | 'medico' | 'admin';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de login, reemplazar por llamada real al backend
    const user: User = {
      id: 1,
      email,
      rol: 'medico', // Cambia según quieras probar otros roles
    };

    localStorage.setItem('user', JSON.stringify(user));

    switch (user.rol) {
      case 'paciente':
        router.push('/paciente');
        return;
      case 'medico':
        router.push('/medico');
        return;
      case 'admin':
        router.push('/admin');
        return;
      default:
        router.push('/');
        return;
    }
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.h1}>Iniciar sesión</h1>
      <p>Accedé a la plataforma para gestionar tus turnos médicos.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
          marginTop: '2rem',
        }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
