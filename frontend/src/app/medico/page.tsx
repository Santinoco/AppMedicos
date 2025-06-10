"use client";

import { useRouter } from "next/navigation";

interface Turno {
  id: number;
  nombre: string;
  email: string;
  motivo: string;
  fechaTurno: Date;
  especialidad: string;
}

interface Medico {
  nombre: String;
  especialidad: String[];
  localidad: String;
  telefono: number;
  email: String;
}

export default function MedicoDashboard() {
  const router = useRouter();
  const turno: Turno = {
    id: 1,
    nombre: "Juan Perez",
    email: "juan@mail.com",
    motivo: "Fiebre",
    fechaTurno: new Date("2025-05-29T10:30:00"),
    especialidad: "Neurología",
  };

  const medico: Medico = {
    nombre: "Dr. Juan Perez",
    especialidad: ["Neurología", "Cardiología"],
    localidad: "Buenos Aires",
    telefono: 123456789,
    email: "medico@mail.com",
  };

  return (
    <main className="flex-1 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, {medico.nombre}
      </h1>
      <p>📌 Especialidad: {medico.especialidad.join(", ")}</p>
      <p>📍 Localidad: {medico.localidad}</p>
      <p>Telefono: {medico.telefono}</p>
      <p>Email: {medico.email}</p>
      <section className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          📌 Próximo turno
        </h3>
        <p>
          <strong>{turno.nombre}</strong> ({turno.especialidad})<br />
          📅{" "}
          {new Intl.DateTimeFormat("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(turno.fechaTurno)}
        </p>
      </section>
      <button
        onClick={() => router.push("/medico/mis-turnos")}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Ver mas turnos
      </button>
    </main>
  );
}
