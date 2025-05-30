import Link from "next/link";

export default function Home() {
  return (
    <div className="main">
      <h1 className="h1 text-4xl mb-4">Bienvenido a Turnos Médicos App</h1>
      <p>
        Gestioná fácilmente la agenda de turnos y pacientes de tu consultorio
        médico.
      </p>

      <ul>
        <li>✅ Reserva de turnos online sin llamadas</li>
        <li>✅ Organización clara por médico</li>
        <li>✅ Acceso rápido para pacientes</li>
      </ul>

      <Link href="/login">
        <button className="button">Iniciar sesión</button>
      </Link>
    </div>
  );
}
