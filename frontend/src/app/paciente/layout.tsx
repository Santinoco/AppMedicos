'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function PacienteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/paciente', label: 'Inicio' },
    { href: '/paciente/mis-turnos', label: 'Mis turnos' },
    { href: '/paciente/listado-medicos', label: 'Cartilla de médicos' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Paciente</h2>
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'py-2 px-3 rounded transition',
                pathname === href
                  ? 'bg-green-100 text-green-800 font-semibold'
                  : 'text-green-700 hover:bg-green-200 hover:text-green-900'
              )}
            >
              {label}
            </Link>

          ))}
          <Link
            key={"/"}
            href={"/"}
            className={clsx(
              "py-2 px-3 rounded transition",
              pathname === "/"
                ? "bg-green-100 text-green-800 font-semibold"
                : "text-green-700 hover:bg-green-200 hover:text-green-900"
            )}
            onClick={() => localStorage.removeItem("token")}
          //invalidar token en backend ?
          >
            Cerrar sesion
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 space-y-6">
        {children}
      </main>
    </div>
  );
}
