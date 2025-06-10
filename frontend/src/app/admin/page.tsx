"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  tipo: number;
}

const usuariosInicial: Usuario[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    email: "juan@mail.com",
    activo: true,
    tipo: 0, // 0 = medico, 1 = paciente
  },
  {
    id: 2,
    nombre: "Maria",
    apellido: "Perez",
    email: "maria@mail.com",
    activo: false,
    tipo: 1, // 0 = medico, 1 = paciente
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosInicial);

  const eliminarUsuario = (idUsuario: number) => {
    // Implementar la lógica para eliminar el usuario.
    // Por ahora, solo mostramos un mensaje de confirmación.
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      // Implementar llamada a la API para eliminar el usuario

      // Modificacion visual de la lista de usuarios local
      const nuevaListaUsuarios = usuarios.filter(
        (usuario) => usuario.id !== idUsuario
      );
      setUsuarios(nuevaListaUsuarios);
      alert(`Usuario con ID ${idUsuario} eliminado.`);
    }
  };

  return (
    <main className="flex-1 p-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">
        Bienvenido, Administrador
      </h1>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>
        {usuarios.length === 0 ? (
          <p className="text-gray-500">No se encuentra ningun ususario.</p>
        ) : (
          <ul className="space-y-4">
            {usuarios.map((usuario) => (
              <li
                className="border p-4 rounded-lg flex justify-between items-start"
                key={usuario.id}
              >
                <div>
                  <div>
                    <span className="font-bold">
                      {usuario.nombre} {usuario.apellido}
                    </span>{" "}
                    <span className="text-gray-500 font-light">
                      - {usuario.email}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-bold mr-2">Tipo de usuario:</span>
                    {usuario.tipo === 0 ? (
                      <span>Medico</span>
                    ) : (
                      <span>Paciente</span>
                    )}
                  </div>
                  <div className="mb-1">
                    <span>
                      {usuario.activo ? (
                        <strong className="text-green-600">Activo</strong>
                      ) : (
                        <strong className="text-red-700">Inactivo</strong>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex-col flex gap-4 items-center">
                  <button
                    onClick={() => router.push("/admin/usuario/" + usuario.id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                  >
                    Ver usuario
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition w-full"
                  >
                    Eliminar Usuario
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
        Ver mas usuarios
      </button>
    </main>
  );
}
