"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BackMedico } from "../../types/backMedico";
import { BackPaciente } from "../../types/backPaciente";
import { verificarTipoUsuario } from "../../services/guardService";

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
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [mostrarMedicos, setMostrarMedicos] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const token = localStorage.getItem("access_token");
    
    try {
      if (mostrarMedicos) {
        const response = await axios.get(
          `http://localhost:3000/doctors?page=${page}&limit=${ITEMS_PER_PAGE}`,
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
          `http://localhost:3000/patients?page=${page}&limit=${ITEMS_PER_PAGE}`,
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
        `http://localhost:3000/${rol}/by-name/${nombre}?page=${page}&limit=${ITEMS_PER_PAGE}`,
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
    setCurrentPage(1);
    if (nombre.trim()) {
      filtrarPorNombre(nombre, 1);
    } else {
      fetchUsuarios(1);
    }
  };

  const eliminarUsuario = async (idUsuario: number, tipo: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const token = localStorage.getItem("access_token");
      try {
        await axios.delete(`http://localhost:3000/users/${idUsuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Refresca la página actual después de eliminar
        if (filtroNombre.trim()) {
          filtrarPorNombre(filtroNombre, currentPage);
        } else {
          fetchUsuarios(currentPage);
        }
        
        alert(`Usuario eliminado correctamente.`);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("No se pudo eliminar el usuario. Inténtalo más tarde.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const cambiarTipo = (esMedico: boolean) => {
    setMostrarMedicos(esMedico);
    setCurrentPage(1);
    setFiltroNombre("");
  };

  const goToNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination?.hasPreviousPage) {
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
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;
    
    // Mostrar máximo 5 páginas
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);
    
    // Ajustar si estamos cerca del inicio o final
    if (current <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (current > totalPages - 3) {
      startPage = Math.max(1, totalPages - 4);
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
        {pagination && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} resultados
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando...</p>
          </div>
        )}

        {/* Lista de usuarios */}
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
                            onClick={() =>
                              eliminarUsuario(medico.usuario.id, "medico")
                            }
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
                          onClick={() =>
                            eliminarUsuario(paciente.usuario.id, "paciente")
                          }
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
      {pagination && pagination.totalPages > 1 && !loading && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          {/* Botón Anterior */}
          <button
            onClick={goToPreviousPage}
            disabled={!pagination.hasPreviousPage}
            className={`px-4 py-2 rounded ${
              pagination.hasPreviousPage
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
                  pageNum === pagination.currentPage
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Última página si no está visible */}
            {getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages - 1 && (
                  <span className="px-2 py-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => goToPage(pagination.totalPages)}
                  className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={goToNextPage}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded ${
              pagination.hasNextPage
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition`}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Información adicional de paginación */}
      {pagination && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Página {pagination.currentPage} de {pagination.totalPages}
        </div>
      )}
    </section>
  </main>
);
}