"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackMedico } from "../../types/backMedico";
import { BackPaciente } from "../../types/backPaciente";
import { verificarTipoUsuario } from "../../services/guardService";
import { toast } from "sonner";

interface Medico {
  especialidad: string;
  matricula: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
}

interface Paciente {
  consultasCompletadas: number;
  seguroMedico: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [mostrarMedicos, setMostrarMedicos] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [current_page, setCurrent_page] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para el modal de confirmación
  const [mostrarModalConfirm, setMostrarModalConfirm] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<{ id: number; tipo: string } | null>(null);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const verificarAcceso = async () => {
      const esAdmin = verificarTipoUsuario("administrator");
      if (!esAdmin) {
        router.push("/");
      } else {
        setIsVerified(true);
      }
    };
    verificarAcceso();
  }, [router]);

  useEffect(() => {
    if (isVerified) {
      setCurrent_page(1);
      setFiltroNombre("");
      fetchUsuarios(1);
    }
  }, [isVerified, mostrarMedicos]);

  useEffect(() => {
    if (isVerified) {
      if (filtroNombre.trim()) {
        filtrarPorNombre(filtroNombre, current_page);
      } else {
        fetchUsuarios(current_page);
      }
    }
  }, [current_page]);

  const fetchUsuarios = async (page: number) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      if (mostrarMedicos) {
        const response = await axios.get(
          `http://localhost:3000/doctors/limit?page=${page}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const medicosData: Medico[] = response.data.data.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            usuario: {
              id: medico.user.id,
              nombre: medico.user.nombre,
              apellido: medico.user.apellido,
              email: medico.user.email,
              activo: medico.user.activo,
            },
          })
        );

        setMedicos(medicosData);
        setPagination(response.data.pagination);
      } else {
        const response = await axios.get(
          `http://localhost:3000/patients/limit?page=${page}&limit=${ITEMS_PER_PAGE}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const pacientesData: Paciente[] = response.data.data.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            usuario: {
              id: paciente.user.id,
              nombre: paciente.user.nombre,
              apellido: paciente.user.apellido,
              email: paciente.user.email,
              activo: paciente.user.activo,
            },
          })
        );

        setPacientes(pacientesData);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      toast.error("No se pudieron obtener los usuarios. Intente más tarde");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorNombre = async (nombre: string, page: number = 1) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const rol = mostrarMedicos ? "doctors" : "patients";

    try {
      const response = await axios.get(
        `http://localhost:3000/${rol}/limit/by-name/${nombre}?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (mostrarMedicos) {
        const medicosFiltrados: Medico[] = response.data.data.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            usuario: {
              id: medico.user.id,
              nombre: medico.user.nombre,
              apellido: medico.user.apellido,
              email: medico.user.email,
              activo: medico.user.activo,
            },
          })
        );
        setMedicos(medicosFiltrados);
      } else {
        const pacientesFiltrados: Paciente[] = response.data.data.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            usuario: {
              id: paciente.user.id,
              nombre: paciente.user.nombre,
              apellido: paciente.user.apellido,
              email: paciente.user.email,
              activo: paciente.user.activo,
            },
          })
        );
        setPacientes(pacientesFiltrados);
      }
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error al filtrar por nombre:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (nombre: string) => {
    setFiltroNombre(nombre);
    setCurrent_page(1);
    if (nombre.trim()) {
      filtrarPorNombre(nombre, 1);
    } else {
      fetchUsuarios(1);
    }
  };

  // Mostrar modal confirmación antes de eliminar
  const confirmarEliminacion = (idUsuario: number, tipo: string) => {
    setUsuarioAEliminar({ id: idUsuario, tipo });
    setMostrarModalConfirm(true);
  };

  // Ejecutar eliminación confirmada
  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:3000/users/${usuarioAEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMostrarModalConfirm(false);
      setUsuarioAEliminar(null);

      // Refrescar lista después de eliminar
      if (filtroNombre.trim()) {
        filtrarPorNombre(filtroNombre, current_page);
      } else {
        fetchUsuarios(current_page);
      }

      toast.success(`Usuario eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      toast.error("No se pudo eliminar el usuario. Inténtalo más tarde");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const cambiarTipo = (esMedico: boolean) => {
    setMostrarMedicos(esMedico);
    setCurrent_page(1);
    setFiltroNombre("");
  };

  const goToNextPage = () => {
    if (pagination?.has_next_page) {
      setCurrent_page(current_page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination?.has_previous_page) {
      setCurrent_page(current_page - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrent_page(page);
  };

  const getPageNumbers = () => {
    if (!pagination) return [];

    const pages = [];
    const total_pages = pagination.total_pages;
    const current = pagination.current_page;

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total_pages, current + 2);

    if (current <= 3) {
      endPage = Math.min(5, total_pages);
    }
    if (current > total_pages - 3) {
      startPage = Math.max(1, total_pages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <main className="flex-1 p-10 space-y-6 relative">
      <div className="flex">
        <h1 className="text-3xl font-bold text-green-800">
          Bienvenido, Administrador
        </h1>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ml-auto"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              mostrarMedicos
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={mostrarMedicos}
            onClick={() => cambiarTipo(true)}
          >
            Médicos
          </button>
          <button
            className={`py-2 px-4 rounded ${
              !mostrarMedicos
                ? "bg-green-600 text-white cursor-default"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={!mostrarMedicos}
            onClick={() => cambiarTipo(false)}
          >
            Pacientes
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          {mostrarMedicos ? "Médicos registrados" : "Pacientes registrados"}
        </h2>

        <div className="my-4">
          <label htmlFor="nombre" className="mr-2">
            Filtrar:
          </label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese un nombre"
            value={filtroNombre}
            onChange={(e) => handleFiltroChange(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        {pagination && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando{" "}
            {pagination.total_items === 0
              ? 0
              : (pagination.current_page - 1) * pagination.items_per_page + 1}{" "}
            -{" "}
            {Math.min(
              pagination.current_page * pagination.items_per_page,
              pagination.total_items
            )}{" "}
            de {pagination.total_items} resultados
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando...</p>
          </div>
        )}

        {!loading && (
          <>
            {mostrarMedicos ? (
              <div>
                {medicos.length === 0 ? (
                  <p className="text-gray-500">No se encuentra ningún médico.</p>
                ) : (
                  <ul className="space-y-4">
                    {medicos.map((medico) => (
                      <li
                        className="border p-4 rounded-lg flex justify-between items-start"
                        key={medico.usuario.id}
                      >
                        <div>
                          <div>
                            <span className="font-bold">
                              {medico.usuario.nombre} {medico.usuario.apellido}
                            </span>{" "}
                            <span className="text-gray-500 font-light">
                              - {medico.usuario.email}
                            </span>
                          </div>
                          <div className="mb-1">
                            <span className="">Especialidad: </span>{" "}
                            {medico.especialidad}
                          </div>
                          <div className="mb-1">
                            <span className=" mr-1">Matricula:</span>
                            {medico.matricula}
                          </div>
                          <div className="mb-1">
                            <span>
                              {medico.usuario.activo ? (
                                <strong className="text-green-600">Activo</strong>
                              ) : (
                                <strong className="text-red-700">Inactivo</strong>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex-col flex gap-4 items-center">
                          <button
                            onClick={() =>
                              router.push("/admin/medico/" + medico.usuario.id)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                          >
                            Ver usuario
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(medico.usuario.id, "medico")}
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition w-full"
                          >
                            Eliminar Usuario
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div>
                {pacientes.length === 0 ? (
                  <p className="text-gray-500">No se encuentra ningún paciente.</p>
                ) : (
                  <ul className="space-y-4">
                    {pacientes.map((paciente) => (
                      <li
                        className="border p-4 rounded-lg flex justify-between items-start"
                        key={paciente.usuario.id}
                      >
                        <div>
                          <div>
                            <span className="font-bold">
                              {paciente.usuario.nombre} {paciente.usuario.apellido}
                            </span>{" "}
                            <span className="text-gray-500 font-light">
                              - {paciente.usuario.email}
                            </span>
                          </div>
                          <div className="mb-1">
                            <span>Consultas completadas: </span>
                            {paciente.consultasCompletadas}
                          </div>
                          <div className="mb-1">
                            <span>Seguro médico: </span>
                            {paciente.seguroMedico || "No especificado"}
                          </div>
                          <div className="mb-1">
                            <span>
                              {paciente.usuario.activo ? (
                                <strong className="text-green-600">Activo</strong>
                              ) : (
                                <strong className="text-red-700">Inactivo</strong>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex-col flex gap-4 items-center">
                          <button
                            onClick={() =>
                              router.push("/admin/paciente/" + paciente.usuario.id)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                          >
                            Ver usuario
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(paciente.usuario.id, "paciente")}
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition w-full"
                          >
                            Eliminar Usuario
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal de confirmación personalizado */}
        {mostrarModalConfirm && (
          <div className="fixed inset-0 bg-gray-200/40 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-300">
              <p className="text-gray-800 text-lg mb-6 text-center">
                ¿Estás seguro de que deseas eliminar este usuario?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={eliminarUsuario}
                  className="px-4 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrarModalConfirm(false)}
                  className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controles de paginación */}
        {pagination && pagination.total_pages > 1 && !loading && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={!pagination.has_previous_page}
              className={`px-4 py-2 rounded ${
                pagination.has_previous_page
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition`}
            >
              Anterior
            </button>

            <div className="flex space-x-1">
              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    1
                  </button>
                  {getPageNumbers()[0] > 2 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded transition ${
                    pageNum === pagination.current_page
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < pagination.total_pages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < pagination.total_pages - 1 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => goToPage(pagination.total_pages)}
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    {pagination.total_pages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={!pagination.has_next_page}
              className={`px-4 py-2 rounded ${
                pagination.has_next_page
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition`}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
