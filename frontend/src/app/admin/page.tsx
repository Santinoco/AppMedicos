"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verificarTipoUsuario } from "../../services/guardService";
import axios from "axios";
import { Paciente } from "../../types/Paciente";
import { Medico } from "../../types/Medico";
import { BackPaciente } from "../../types/backPaciente";
import { deleteUser } from "../../services/userService";
import { BackMedico } from "../../types/backMedico";
import {
  getDoctorsByNamePaginated,
  getDoctorsPaginated,
} from "../../services/doctorService";
import {
  getPatientsByNamePaginated,
  getPatientsPaginated,
} from "../../services/patientService";
import { PaginationInfo } from "../../types/PaginatedResponse";

export default function AdminDashboard() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [mostrarMedicos, setMostrarMedicos] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Estado para controlar la verificación
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar el fin de la carga de datos
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [filtroNombre, setFiltroNombre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
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
      setCurrentPage(1);
      setFiltroNombre("");
      fetchUsuarios(1);
    }
  }, [isVerified, mostrarMedicos]);

  useEffect(() => {
    if (isVerified) {
      if (filtroNombre.trim()) {
        filtrarPorNombre(filtroNombre, currentPage);
      } else {
        fetchUsuarios(currentPage);
      }
    }
  }, [currentPage]);

  const fetchUsuarios = async (page: number) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");

    try {
      if (mostrarMedicos) {
        const medicosData = await getDoctorsPaginated(page, ITEMS_PER_PAGE);
        const medicosMapeado: Medico[] = medicosData.data.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            comienzoJornada: medico.shift_start,
            finJornada: medico.shift_end,
            usuario: medico.user,
          })
        );

        setMedicos(medicosMapeado);
        setPagination(medicosData.pagination);
      } else {
        const pacientesData = await getPatientsPaginated(page, ITEMS_PER_PAGE);
        const pacientesMapeado: Paciente[] = pacientesData.data.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            historialMedico: paciente.medical_history,
            peso: paciente.weight,
            altura: paciente.height,
            tipoSangre: paciente.blood_type,
            usuario: paciente.user,
          })
        );
        setPacientes(pacientesMapeado);
        setPagination(pacientesData.pagination);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setError("No se pudieron cargar los usuarios. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarPorNombre = async (nombre: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mostrarMedicos) {
        const medicosData = await getDoctorsByNamePaginated(
          nombre,
          page,
          ITEMS_PER_PAGE
        );
        const medicosMapeado: Medico[] = medicosData.data.map(
          (medico: BackMedico) => ({
            especialidad: medico.specialty,
            matricula: medico.license_number,
            comienzoJornada: medico.shift_start,
            finJornada: medico.shift_end,
            usuario: medico.user,
          })
        );
        setMedicos(medicosMapeado);
        setPagination(medicosData.pagination);
      } else {
        const pacientesData = await getPatientsByNamePaginated(
          nombre,
          page,
          ITEMS_PER_PAGE
        );
        const pacientesMapeado: Paciente[] = pacientesData.data.map(
          (paciente: BackPaciente) => ({
            consultasCompletadas: paciente.completed_consultations,
            seguroMedico: paciente.health_insurance,
            historialMedico: paciente.medical_history,
            peso: paciente.weight,
            altura: paciente.height,
            tipoSangre: paciente.blood_type,
            usuario: paciente.user,
          })
        );
        setPacientes(pacientesMapeado);
        setPagination(pacientesData.pagination);
      }
    } catch (error) {
      console.error("Error al filtrar por nombre:", error);
      setError("No se pudo realizar la búsqueda. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltroChange = (nombre: string) => {
    setFiltroNombre(nombre);
    setCurrentPage(1);
    if (nombre.trim()) {
      filtrarPorNombre(nombre, 1);
    } else {
      fetchUsuarios(1);
    }
  };

  const eliminarUsuario = async (idUsuario: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await deleteUser(idUsuario);
        alert(`Usuario eliminado correctamente.`);

        if (filtroNombre.trim()) {
          filtrarPorNombre(filtroNombre, currentPage);
        } else {
          fetchUsuarios(currentPage);
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          alert(
            "Error del servidor: No se puede eliminar el usuario. Es probable que todavía tenga datos asociados (como turnos activos o un perfil de médico/paciente)."
          );
        } else {
          alert("No se pudo eliminar el usuario. Inténtalo más tarde.");
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    router.push("/");
  };

  const cambiarTipo = (esMedico: boolean) => {
    setMostrarMedicos(esMedico);
  };

  const goToNextPage = () => {
    if (pagination?.has_next_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination?.has_previous_page) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Función para generar números de página a mostrar
  const getPageNumbers = () => {
    if (!pagination) return [];

    const pages = [];
    const total_pages = pagination.total_pages;
    const current = pagination.current_page;

    // Mostrar máximo 5 páginas
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total_pages, current + 2);

    // Ajustar si estamos cerca del inicio o final
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
    <main className="flex-1 p-10 space-y-6">
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

        {/* Información de paginación */}
        {pagination && !isLoading && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando{" "}
            {(pagination.current_page - 1) * pagination.items_per_page + 1} -{" "}
            {Math.min(
              pagination.current_page * pagination.items_per_page,
              pagination.total_items
            )}{" "}
            de {pagination.total_items} resultados
          </div>
        )}

        {/* Loading indicator */}
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : (
          <>
            {mostrarMedicos ? (
              <div>
                {medicos.length === 0 ? (
                  <p className="text-gray-500">
                    No se encuentra ningún médico.
                  </p>
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
                                <strong className="text-green-600">
                                  Activo
                                </strong>
                              ) : (
                                <strong className="text-red-700">
                                  Inactivo
                                </strong>
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
                            onClick={() => eliminarUsuario(medico.usuario.id)}
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
                  <p className="text-gray-500">
                    No se encuentra ningún paciente.
                  </p>
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
                              {paciente.usuario.nombre}{" "}
                              {paciente.usuario.apellido}
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
                                <strong className="text-green-600">
                                  Activo
                                </strong>
                              ) : (
                                <strong className="text-red-700">
                                  Inactivo
                                </strong>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex-col flex gap-4 items-center">
                          <button
                            onClick={() =>
                              router.push(
                                "/admin/paciente/" + paciente.usuario.id
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition w-full"
                          >
                            Ver usuario
                          </button>
                          <button
                            onClick={() => eliminarUsuario(paciente.usuario.id)}
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

        {/* Controles de paginación */}
        {pagination && pagination.total_pages > 1 && !isLoading && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            {/* Botón Anterior */}
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

            {/* Números de página */}
            <div className="flex space-x-1">
              {/* Primera página si no está visible */}
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

              {/* Páginas visibles */}
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

              {/* Última página si no está visible */}
              {getPageNumbers()[getPageNumbers().length - 1] <
                pagination.total_pages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] <
                    pagination.total_pages - 1 && (
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

            {/* Botón Siguiente */}
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

        {/* Información adicional de paginación */}
        {pagination && !isLoading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Página {pagination.current_page} de {pagination.total_pages}
          </div>
        )}
      </section>
    </main>
  );
}
