"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserId } from "../../services/userIdService";
import axios from "axios";
import { BackUser } from "../../types/backUser";

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
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    activo: false,
    tipo: 0, // 1 = admin, 2 = medico, 5 = paciente
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosInicial);
  // REEMPLAZAR con getUserId() cuando esté implementado el back
  // const userId = getUserId();
  const userId = 1;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        /*
        const responseUsuarios = await axios.get(`http://localhost:3001/users`);
        const usuariosData: Usuario[] = responseUsuarios.data.map(
          (usuario: BackUser) => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            activo: usuario.activo,
            tipo: usuario.user_type_id,
          })
        );
        */
        // Simulacion de datos de turnos (reemplazar con la llamada al backend)
        const usuariosData: Usuario[] = [
          {
            id: 1,
            nombre: "Juan",
            apellido: "Perez",
            email: "juan@mail.com",
            activo: true,
            tipo: 2, // 1 = admin, 2 = medico, 5 = paciente
          },
          {
            id: 2,
            nombre: "Maria",
            apellido: "Perez",
            email: "maria@mail.com",
            activo: false,
            tipo: 5, // 1 = admin, 2 = medico, 5 = paciente
          },
        ];
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [userId]);
  const eliminarUsuario = async (idUsuario: number) => {
    // Implementar la lógica para eliminar el usuario.
    // Por ahora, solo mostramos un mensaje de confirmación.
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      await axios.delete(`http://localhost:3001/users/${idUsuario}`);
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
      <div className="flex">
        <h1 className="text-3xl font-bold text-green-800">
          Bienvenido, Administrador
        </h1>
        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto">
          <Link
            key={"/"}
            href={"/"}
            onClick={() => localStorage.removeItem("token")}
            //invalidar token en backend ?
          >
            Cerrar sesion
          </Link>
        </button>
      </div>
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
                    {usuario.tipo === 2 ? (
                      <span>Medico</span>
                    ) : usuario.tipo === 5 ? (
                      <span>Paciente</span>
                    ) : (
                      <span></span>
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
    </main>
  );
}
