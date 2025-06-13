"use client";
import { useState } from "react";
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
  especialidad: String;
  numeroMatricula: number;
  email: String;
  comienzoJornada: string;
  finJornada: string;
}

export default function MedicoDashboard() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comienzoJornada, setComienzoJornada] = useState<number | null>(null);
  const [finJornada, setFinJornada] = useState<number | null>(null);
  const [medico, setMedico] = useState<Medico>({
    nombre: "Dr. Juan Perez",
    especialidad: "Cardiología",
    numeroMatricula: 123456,
    email: "medico@mail.com",
    comienzoJornada: "12:00",
    finJornada: "18:30",
  });
  const turno: Turno = {
    id: 1,
    nombre: "Juan Perez",
    email: "juan@mail.com",
    motivo: "Fiebre",
    fechaTurno: new Date("2025-05-29T10:30:00"),
    especialidad: "Neurología",
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      comienzoJornada &&
      finJornada &&
      comienzoJornada >= 1000 &&
      finJornada <= 1900 &&
      comienzoJornada < finJornada
    ) {
      setMedico((prevMedico) => ({
        ...prevMedico,
        comienzoJornada: `${String(comienzoJornada).slice(0, 2)}:${String(
          comienzoJornada
        ).slice(2)}`,
        finJornada: `${String(finJornada).slice(0, 2)}:${String(
          finJornada
        ).slice(2)}`,
      }));
      alert(`Jornada actualizada: ${comienzoJornada} - ${finJornada}`);
      // Agregar lógica para enviar los datos al backend con post
    } else {
      alert("Por favor, ingrese valores válidos.");
    }
  };

  return (
    <main className="flex-1 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, {medico.nombre}
      </h1>
      <p>Especialidad: {medico.especialidad}</p>
      <p>Numero de matricula: {medico.numeroMatricula}</p>
      <p>
        Jornada laboral: {medico.comienzoJornada} a {medico.finJornada}
      </p>
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
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mr-8"
      >
        Ver mas turnos
      </button>
      <button
        onClick={toggleFormulario}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        {mostrarFormulario ? "Ocultar formulario" : "Editar jornada"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="comienzoJornada" className="block font-bold">
              Comienzo Jornada:
            </label>
            <input
              type="number"
              id="comienzoJornada"
              value={comienzoJornada || ""}
              onChange={(e) => setComienzoJornada(Number(e.target.value))}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Ingrese un número de 4 dígitos mayor o igual a 1000"
            />
          </div>
          <div>
            <label htmlFor="finJornada" className="block font-bold">
              Fin Jornada:
            </label>
            <input
              type="number"
              id="finJornada"
              value={finJornada || ""}
              onChange={(e) => setFinJornada(Number(e.target.value))}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Ingrese un número de 4 dígitos menor o igual a 1900"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </form>
      )}
    </main>
  );
}
